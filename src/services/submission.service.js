const axios = require("axios");
const dotenv = require("dotenv");
const { MockExecutorService } = require("./mock-executor.service.js");

dotenv.config();

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || "http://103.20.97.228:2358";

// Supported languages in Judge0
const SUPPORTED_LANGUAGES = {
    54: "cpp17", // C++17
    50: "c", // C
    62: "java", // Java
    71: "python3", // Python 3
    63: "javascript", // JavaScript
    74: "typescript", // TypeScript
    51: "csharp", // C# 
    73: "rust", // Rust
    75: "go", // Go
    76: "kotlin", // Kotlin
    77: "swift", // Swift
    78: "php", // PHP
    79: "ruby", // Ruby
    80: "scala", // Scala
    81: "dart", // Dart
    82: "elixir", // Elixir
    83: "erlang", // Erlang
    84: "haskell", // Haskell
    85: "clojure", // Clojure
    86: "lua", // Lua
    87: "perl", // Perl
    88: "r", // R
    89: "sql", // SQL
    90: "bash", // Bash
    91: "powershell", // PowerShell
    92: "cobol", // COBOL
    93: "fortran", // Fortran
    94: "pascal", // Pascal
    95: "prolog", // Prolog
    96: "scheme", // Scheme
    97: "smalltalk", // Smalltalk
    98: "tcl", // Tcl
    99: "whitespace", // Whitespace
    100: "brainfuck", // Brainfuck
};

class SubmissionService {
    constructor() {
        // Judge0 API không cần /api suffix
        this.baseURL = JUDGE0_API_URL;
        this.timeout = 30000; // 30 seconds timeout
        this.mockExecutor = new MockExecutorService();
    }

    async submit({ source_code, language_id, stdin, problemId, testCases }) {
        try {
            // Validate language_id
            if (!SUPPORTED_LANGUAGES[language_id]) {
                throw new Error(`Unsupported language ID: ${language_id}. Supported languages: ${Object.keys(SUPPORTED_LANGUAGES).join(', ')}`);
            }

            // Validate source_code
            if (!source_code || source_code.trim().length === 0) {
                throw new Error("Source code cannot be empty");
            }

            console.log(`Submitting to Judge0: ${this.baseURL}/submissions`);
            console.log(`Language ID: ${language_id} (${SUPPORTED_LANGUAGES[language_id]})`);
            console.log(`Input: ${stdin || 'None'}`);

            // Check if Judge0 is available first
            const healthCheck = await this.healthCheck();
            if (healthCheck.status !== 'healthy') {
                console.log("Judge0 service is not available, using mock response");
                return this.getMockSubmission(source_code, language_id, stdin, testCases);
            }

            if (testCases && testCases.length > 0) {
                // Submit multiple test cases in parallel
                const submissions = await Promise.all(
                    testCases.map(async (testCase, index) => {
                        try {
                            const response = await axios.post(`${this.baseURL}/submissions`, {
                                source_code,
                                language_id,
                                stdin: testCase.input || "",
                                expected_output: testCase.output || "",
                                wait: false,
                            }, {
                                timeout: this.timeout
                            });
                            
                            console.log(`Test case ${index + 1} submitted successfully:`, response.data.token);
                            return response.data.token;
                        } catch (error) {
                            console.error(`Error submitting test case ${index + 1}:`, error.message);
                            throw error;
                        }
                    })
                );

                return {
                    tokens: submissions,
                    status: "Submitted",
                    message: `Successfully submitted ${submissions.length} test cases`,
                    language: SUPPORTED_LANGUAGES[language_id]
                };
            }

            // Single submission case
            const response = await axios.post(`${this.baseURL}/submissions`, {
                source_code,
                language_id,
                stdin: stdin || "",
                wait: false,
            }, {
                timeout: this.timeout
            });

            console.log("Single submission successful:", response.data.token);

            return {
                token: response.data.token,
                status: "Submitted",
                message: "Code submitted successfully",
                language: SUPPORTED_LANGUAGES[language_id]
            };
        } catch (error) {
            console.error("Error submitting to Judge0:", error.message);
            
            // If Judge0 is not available, return mock response
            if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || 
                error.message.includes('Cannot connect to Judge0') ||
                error.message.includes('Request timeout')) {
                console.log("Judge0 service is not available, using mock response");
                return this.getMockSubmission(source_code, language_id, stdin, testCases);
            }
            
            if (error.response) {
                console.error("Judge0 error response:", error.response.data);
                throw new Error(`Judge0 API Error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`);
            } else if (error.code === 'ECONNABORTED') {
                throw new Error("Request timeout - Judge0 service may be slow or unavailable");
            } else {
                throw new Error(`Submission failed: ${error.message}`);
            }
        }
    }

    // Mock submission for testing when Judge0 is not available
    getMockSubmission(source_code, language_id, stdin, testCases) {
        const mockToken = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        if (testCases && testCases.length > 0) {
            const mockTokens = testCases.map((_, index) => `mock_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`);
            return {
                tokens: mockTokens,
                status: "Submitted (Mock)",
                message: `Mock submission: ${testCases.length} test cases submitted`,
                language: SUPPORTED_LANGUAGES[language_id],
                note: "This is a mock response - Judge0 service is not available"
            };
        }

        return {
            token: mockToken,
            status: "Submitted (Mock)",
            message: "Code submitted successfully (Mock)",
            language: SUPPORTED_LANGUAGES[language_id],
            note: "This is a mock response - Judge0 service is not available"
        };
    }

    async getSubmission(token) {
        try {
            // Check if this is a mock token
            if (typeof token === 'string' && token.startsWith('mock_')) {
                return this.getMockSubmissionResult(token);
            }

            if (Array.isArray(token)) {
                // Check if all tokens are mock tokens
                if (token.every(t => typeof t === 'string' && t.startsWith('mock_'))) {
                    return this.getMockSubmissionResults(token);
                }

                // Get multiple submission results in parallel
                const results = await Promise.all(
                    token.map(async (t, index) => {
                        try {
                            if (typeof t === 'string' && t.startsWith('mock_')) {
                                return this.getMockSubmissionResult(t, index + 1);
                            }
                            
                            const response = await axios.get(`${this.baseURL}/submissions/${t}`, {
                                timeout: this.timeout
                            });
                            
                            return this.formatSubmissionResult(response.data, index + 1);
                        } catch (error) {
                            console.error(`Error fetching test case ${index + 1} result:`, error.message);
                            return {
                                testCase: index + 1,
                                status: "Error",
                                error: error.message,
                                passed: false
                            };
                        }
                    })
                );

                return {
                    type: "multiple",
                    results,
                    summary: {
                        total: results.length,
                        passed: results.filter(r => r.passed).length,
                        failed: results.filter(r => !r.passed).length
                    }
                };
            }

            // Single submission result
            const response = await axios.get(`${this.baseURL}/submissions/${token}`, {
                timeout: this.timeout
            });

            return this.formatSubmissionResult(response.data);
        } catch (error) {
            console.error("Error fetching from Judge0:", error.message);
            
            if (error.response) {
                if (error.response.status === 404) {
                    throw new Error("Submission not found - token may be invalid or expired");
                }
                throw new Error(`Judge0 API Error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`);
            } else if (error.code === 'ECONNABORTED') {
                throw new Error("Request timeout - Judge0 service may be slow");
            } else {
                throw new Error(`Failed to fetch submission: ${error.message}`);
            }
        }
    }

    // Mock submission result for testing
    getMockSubmissionResult(token, testCaseNumber = null, sourceCode = null, input = null) {
        // Use mock executor if we have source code and input
        if (sourceCode && input) {
            const mockResult = this.mockExecutor.executeJavaScript(sourceCode, input);
            
            const result = {
                status: mockResult.status,
                statusId: mockResult.statusId,
                stdout: mockResult.stdout,
                stderr: mockResult.stderr,
                compile_output: mockResult.compile_output,
                message: mockResult.message,
                time: mockResult.time,
                memory: mockResult.memory,
                passed: mockResult.passed,
                language: "JavaScript",
                submitted_at: new Date().toISOString(),
                note: "This is a mock result - Judge0 service is not available"
            };

            if (testCaseNumber) {
                result.testCase = testCaseNumber;
            }

            result.statusDetails = {
                id: mockResult.statusId,
                description: mockResult.status,
                isAccepted: mockResult.statusId === 3,
                isCompilationError: mockResult.statusId === 4,
                isRuntimeError: mockResult.statusId === 5,
                isTimeLimitExceeded: mockResult.statusId === 6,
                isMemoryLimitExceeded: mockResult.statusId === 7,
                isWrongAnswer: mockResult.statusId === 8
            };

            return result;
        }

        // Fallback to old mock system
        const mockResult = this.executeMockCode(token, testCaseNumber);
        
        const result = {
            status: mockResult.status,
            statusId: mockResult.statusId,
            stdout: mockResult.stdout,
            stderr: mockResult.stderr,
            compile_output: mockResult.compile_output,
            message: mockResult.message,
            time: mockResult.time,
            memory: mockResult.memory,
            passed: mockResult.passed,
            language: "JavaScript",
            submitted_at: new Date().toISOString(),
            note: "This is a mock result - Judge0 service is not available"
        };

        if (testCaseNumber) {
            result.testCase = testCaseNumber;
        }

        result.statusDetails = {
            id: mockResult.statusId,
            description: mockResult.status,
            isAccepted: mockResult.statusId === 3,
            isCompilationError: mockResult.statusId === 4,
            isRuntimeError: mockResult.statusId === 5,
            isTimeLimitExceeded: mockResult.statusId === 6,
            isMemoryLimitExceeded: mockResult.statusId === 7,
            isWrongAnswer: mockResult.statusId === 8
        };

        return result;
    }

    // Execute mock code for testing
    executeMockCode(token, testCaseNumber = null) {
        try {
            // For mock testing, we'll simulate different scenarios based on token
            const tokenStr = token.toString();
            
            // Check if it's a syntax error test
            if (tokenStr.includes('syntax') || tokenStr.includes('error')) {
                return {
                    status: "Compilation Error (Mock)",
                    statusId: 4,
                    stdout: "",
                    stderr: "SyntaxError: Unexpected end of input",
                    compile_output: "SyntaxError: Unexpected end of input",
                    message: "Compilation failed",
                    time: 0,
                    memory: 0,
                    passed: false
                };
            }

            // For two-sum problem, simulate correct output based on input
            if (testCaseNumber) {
                const mockOutputs = {
                    1: "[0, 1]", // [2, 7, 11, 15], 9
                    2: "[1, 2]", // [3, 2, 4], 6  
                    3: "[0, 1]"  // [3, 3], 6
                };
                
                return {
                    status: "Accepted (Mock)",
                    statusId: 3,
                    stdout: mockOutputs[testCaseNumber] || "[0, 1]",
                    stderr: "",
                    compile_output: "",
                    message: "Mock execution completed successfully",
                    time: Math.floor(Math.random() * 50) + 10,
                    memory: Math.floor(Math.random() * 500) + 100,
                    passed: true
                };
            }

            // Default mock response
            return {
                status: "Accepted (Mock)",
                statusId: 3,
                stdout: "Mock output: Code executed successfully",
                stderr: "",
                compile_output: "",
                message: "Mock execution completed",
                time: Math.floor(Math.random() * 100) + 10,
                memory: Math.floor(Math.random() * 1000) + 100,
                passed: true
            };

        } catch (error) {
            return {
                status: "Runtime Error (Mock)",
                statusId: 5,
                stdout: "",
                stderr: `Mock runtime error: ${error.message}`,
                compile_output: "",
                message: "Mock execution failed",
                time: 0,
                memory: 0,
                passed: false
            };
        }
    }

    // Mock submission results for multiple test cases
    getMockSubmissionResults(tokens) {
        const results = tokens.map((token, index) => this.getMockSubmissionResult(token, index + 1));
        
        return {
            type: "multiple",
            results,
            summary: {
                total: results.length,
                passed: results.filter(r => r.passed).length,
                failed: results.filter(r => !r.passed).length
            },
            note: "These are mock results - Judge0 service is not available"
        };
    }

    formatSubmissionResult(data, testCaseNumber = null) {
        const result = {
            status: data.status?.description || "Unknown",
            statusId: data.status?.id || 0,
            stdout: data.stdout || "",
            stderr: data.stderr || "",
            compile_output: data.compile_output || "",
            message: data.message || "",
            time: data.time || 0,
            memory: data.memory || 0,
            passed: data.status?.id === 3, // 3 is "Accepted" in Judge0
            language: data.language?.name || "Unknown",
            submitted_at: data.created_at || new Date().toISOString()
        };

        if (testCaseNumber) {
            result.testCase = testCaseNumber;
        }

        // Add detailed status information
        if (data.status) {
            result.statusDetails = {
                id: data.status.id,
                description: data.status.description,
                isAccepted: data.status.id === 3,
                isCompilationError: data.status.id === 4,
                isRuntimeError: data.status.id === 5,
                isTimeLimitExceeded: data.status.id === 6,
                isMemoryLimitExceeded: data.status.id === 7,
                isWrongAnswer: data.status.id === 8
            };
        }

        return result;
    }

    // Get supported languages
    getSupportedLanguages() {
        return SUPPORTED_LANGUAGES;
    }

    // Check if Judge0 service is available
    async healthCheck() {
        try {
            // Judge0 languages endpoint as health check
            const response = await axios.get(`${this.baseURL}/languages`, {
                timeout: 5000
            });
            return {
                status: "healthy",
                message: "Judge0 service is available",
                response: response.data
            };
        } catch (error) {
            return {
                status: "unhealthy",
                message: "Judge0 service is not available",
                error: error.message
            };
        }
    }
}

module.exports = { SubmissionService };

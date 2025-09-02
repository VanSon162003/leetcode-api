import axios from "axios";
import dotenv from "dotenv";

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

export class SubmissionService {
    constructor() {
        // Judge0 API không cần /api suffix
        this.baseURL = JUDGE0_API_URL;
        this.timeout = 30000; // 30 seconds timeout
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
            
            if (error.response) {
                console.error("Judge0 error response:", error.response.data);
                throw new Error(`Judge0 API Error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`);
            } else if (error.code === 'ECONNABORTED') {
                throw new Error("Request timeout - Judge0 service may be slow or unavailable");
            } else if (error.code === 'ENOTFOUND') {
                throw new Error("Cannot connect to Judge0 service - check if the service is running");
            } else {
                throw new Error(`Submission failed: ${error.message}`);
            }
        }
    }

    async getSubmission(token) {
        try {
            if (Array.isArray(token)) {
                // Get multiple submission results in parallel
                const results = await Promise.all(
                    token.map(async (t, index) => {
                        try {
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

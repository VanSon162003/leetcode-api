class TestCaseValidationService {
    constructor() {
        this.maxRetries = 5;
        this.retryDelay = 2000; // 2 seconds
    }

    /**
     * Validate code against test cases
     * @param {string} sourceCode - The source code to test
     * @param {number} languageId - Language ID for Judge0
     * @param {Array} testCases - Array of test cases with input and expected output
     * @param {string} problemId - Problem identifier
     * @returns {Object} Validation result with detailed test case results
     */
    async validateCodeWithTestCases(sourceCode, languageId, testCases, problemId) {
        try {
            console.log(`Starting validation for problem: ${problemId}`);
            console.log(`Testing ${testCases.length} test cases`);

            const results = [];
            let allPassed = true;
            let totalExecutionTime = 0;
            let totalMemoryUsed = 0;

            // Process each test case
            for (let i = 0; i < testCases.length; i++) {
                const testCase = testCases[i];
                console.log(`Processing test case ${i + 1}/${testCases.length}`);

                try {
                    const result = await this.executeTestCase(
                        sourceCode, 
                        languageId, 
                        testCase, 
                        i + 1
                    );

                    results.push(result);
                    totalExecutionTime += result.executionTime || 0;
                    totalMemoryUsed += result.memoryUsed || 0;

                    if (!result.passed) {
                        allPassed = false;
                    }

                } catch (error) {
                    console.error(`Error in test case ${i + 1}:`, error.message);
                    results.push({
                        testCase: i + 1,
                        input: testCase.input,
                        expectedOutput: testCase.output,
                        actualOutput: "",
                        status: "Error",
                        passed: false,
                        error: error.message,
                        executionTime: 0,
                        memoryUsed: 0
                    });
                    allPassed = false;
                }
            }

            const summary = {
                total: testCases.length,
                passed: results.filter(r => r.passed).length,
                failed: results.filter(r => !r.passed).length,
                allPassed: allPassed,
                averageExecutionTime: totalExecutionTime / testCases.length,
                averageMemoryUsed: totalMemoryUsed / testCases.length
            };

            return {
                success: true,
                problemId: problemId,
                summary: summary,
                results: results,
                message: allPassed ? 
                    `All ${testCases.length} test cases passed!` : 
                    `${summary.failed} out of ${testCases.length} test cases failed.`
            };

        } catch (error) {
            console.error("Error in validateCodeWithTestCases:", error);
            return {
                success: false,
                error: error.message,
                problemId: problemId,
                summary: {
                    total: testCases.length,
                    passed: 0,
                    failed: testCases.length,
                    allPassed: false
                },
                results: []
            };
        }
    }

    /**
     * Execute a single test case
     * @param {string} sourceCode - The source code to test
     * @param {number} languageId - Language ID for Judge0
     * @param {Object} testCase - Test case with input and expected output
     * @param {number} testCaseNumber - Test case number for logging
     * @returns {Object} Test case result
     */
    async executeTestCase(sourceCode, languageId, testCase, testCaseNumber) {
        const { SubmissionService } = require('./submission.service.js');
        const submissionService = new SubmissionService();

        try {
            // Submit code with test case input
            const submission = await submissionService.submit({
                source_code: sourceCode,
                language_id: languageId,
                stdin: testCase.input,
                problemId: `test_${testCaseNumber}`
            });

            if (!submission.token) {
                throw new Error("Failed to get submission token");
            }

            // Wait for execution to complete and get result
            // Pass source code and input for better mock execution
            const result = await this.waitForSubmissionResult(
                submissionService, 
                submission.token, 
                sourceCode, 
                testCase.input
            );

            // Compare actual output with expected output
            const comparison = this.compareOutputs(result.stdout, testCase.output);

            return {
                testCase: testCaseNumber,
                input: testCase.input,
                expectedOutput: testCase.output,
                actualOutput: result.stdout,
                status: result.status,
                passed: comparison.passed,
                executionTime: result.time,
                memoryUsed: result.memory,
                comparison: comparison,
                error: result.stderr || result.compile_output || null
            };

        } catch (error) {
            console.error(`Error executing test case ${testCaseNumber}:`, error.message);
            return {
                testCase: testCaseNumber,
                input: testCase.input,
                expectedOutput: testCase.output,
                actualOutput: "",
                status: "Error",
                passed: false,
                executionTime: 0,
                memoryUsed: 0,
                error: error.message
            };
        }
    }

    /**
     * Wait for submission result with retry mechanism
     * @param {SubmissionService} submissionService - Submission service instance
     * @param {string} token - Submission token
     * @param {string} sourceCode - Source code for mock execution
     * @param {string} input - Input for mock execution
     * @returns {Object} Submission result
     */
    async waitForSubmissionResult(submissionService, token, sourceCode = null, input = null) {
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                // For mock tokens, use the enhanced mock system
                if (typeof token === 'string' && token.startsWith('mock_')) {
                    return submissionService.getMockSubmissionResult(token, null, sourceCode, input);
                }
                
                const result = await submissionService.getSubmission(token);
                
                // Check if execution is complete
                if (result.statusId === 1 || result.statusId === 2) {
                    // Still processing, wait and retry
                    if (attempt < this.maxRetries) {
                        console.log(`Submission still processing, attempt ${attempt}/${this.maxRetries}, waiting ${this.retryDelay}ms...`);
                        await this.delay(this.retryDelay);
                        continue;
                    }
                }

                return result;

            } catch (error) {
                console.error(`Attempt ${attempt} failed:`, error.message);
                if (attempt === this.maxRetries) {
                    throw error;
                }
                await this.delay(this.retryDelay);
            }
        }
    }

    /**
     * Compare actual output with expected output
     * @param {string} actual - Actual output from code execution
     * @param {string} expected - Expected output
     * @returns {Object} Comparison result
     */
    compareOutputs(actual, expected) {
        if (!actual && !expected) {
            return { passed: true, message: "Both outputs are empty" };
        }

        if (!actual || !expected) {
            return { 
                passed: false, 
                message: `Output mismatch: actual="${actual}", expected="${expected}"` 
            };
        }

        // Normalize outputs for comparison
        const normalizedActual = this.normalizeOutput(actual);
        const normalizedExpected = this.normalizeOutput(expected);

        // Exact match
        if (normalizedActual === normalizedExpected) {
            return { passed: true, message: "Outputs match exactly" };
        }

        // Try to parse as JSON and compare
        try {
            const actualJson = JSON.parse(normalizedActual);
            const expectedJson = JSON.parse(normalizedExpected);
            
            if (JSON.stringify(actualJson) === JSON.stringify(expectedJson)) {
                return { passed: true, message: "Outputs match (JSON comparison)" };
            }
        } catch (e) {
            // Not JSON, continue with other comparisons
        }

        // Try array comparison (for cases like [1,2,3] vs "1 2 3")
        const actualArray = this.parseArrayOutput(normalizedActual);
        const expectedArray = this.parseArrayOutput(normalizedExpected);
        
        if (actualArray && expectedArray && 
            actualArray.length === expectedArray.length &&
            actualArray.every((val, i) => val === expectedArray[i])) {
            return { passed: true, message: "Outputs match (array comparison)" };
        }

        return { 
            passed: false, 
            message: `Output mismatch: actual="${normalizedActual}", expected="${normalizedExpected}"` 
        };
    }

    /**
     * Normalize output for comparison
     * @param {string} output - Output string
     * @returns {string} Normalized output
     */
    normalizeOutput(output) {
        return output
            .trim()
            .replace(/\r\n/g, '\n')  // Normalize line endings
            .replace(/\r/g, '\n')    // Normalize line endings
            .replace(/\s+/g, ' ')    // Normalize whitespace
            .trim();
    }

    /**
     * Parse array-like output
     * @param {string} output - Output string
     * @returns {Array|null} Parsed array or null
     */
    parseArrayOutput(output) {
        try {
            // Try to parse as JSON array
            const parsed = JSON.parse(output);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (e) {
            // Not JSON, try other formats
        }

        // Try space-separated values
        const spaceSeparated = output.split(/\s+/).map(val => {
            const trimmed = val.trim();
            // Try to convert to number
            const num = parseFloat(trimmed);
            return isNaN(num) ? trimmed : num;
        });

        if (spaceSeparated.length > 1) {
            return spaceSeparated;
        }

        return null;
    }

    /**
     * Delay execution
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} Promise that resolves after delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = { TestCaseValidationService };

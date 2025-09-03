class MockExecutorService {
    constructor() {
        this.timeout = 5000; // 5 seconds timeout
    }

    /**
     * Execute JavaScript code with input (Mock implementation)
     * @param {string} sourceCode - The JavaScript source code
     * @param {string} input - Input data
     * @returns {Object} Execution result
     */
    executeJavaScript(sourceCode, input = '') {
        try {
            // Check for syntax errors first
            if (this.hasSyntaxError(sourceCode)) {
                return {
                    status: "Compilation Error (Mock)",
                    statusId: 4,
                    stdout: "",
                    stderr: "SyntaxError: Unexpected end of input",
                    compile_output: "SyntaxError: Unexpected end of input",
                    message: "Mock compilation failed",
                    time: 0,
                    memory: 0,
                    passed: false
                };
            }

            // Parse input for two-sum problem
            let result = this.simulateTwoSumExecution(sourceCode, input);
            
            if (result) {
                return {
                    status: "Accepted (Mock)",
                    statusId: 3,
                    stdout: result,
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

    /**
     * Simulate two-sum execution based on code analysis
     * @param {string} sourceCode - The JavaScript source code
     * @param {string} input - Input data
     * @returns {string|null} Simulated output or null
     */
    simulateTwoSumExecution(sourceCode, input) {
        try {
            // Parse input
            const lines = input.split('\n');
            if (lines.length < 2) return null;

            const nums = JSON.parse(lines[0]);
            const target = parseInt(lines[1]);

            // Analyze the code to determine if it's correct
            const isCorrectImplementation = this.analyzeTwoSumCode(sourceCode);

            if (isCorrectImplementation) {
                // Simulate correct two-sum algorithm
                const result = this.calculateTwoSum(nums, target);
                return JSON.stringify(result);
            } else {
                // Simulate wrong implementation (always returns [0, 1])
                return "[0, 1]";
            }

        } catch (error) {
            return null;
        }
    }

    /**
     * Analyze if the two-sum code is correct
     * @param {string} sourceCode - The JavaScript source code
     * @returns {boolean} True if code looks correct
     */
    analyzeTwoSumCode(sourceCode) {
        // Simple heuristics to determine if code is correct
        const hasMap = sourceCode.includes('Map') || sourceCode.includes('map');
        const hasLoop = sourceCode.includes('for') || sourceCode.includes('while');
        const hasComplement = sourceCode.includes('complement') || sourceCode.includes('target -');
        const hasReturn = sourceCode.includes('return');
        
        // If it's a simple wrong implementation
        const isSimpleWrong = sourceCode.includes('return [0, 1]') && 
                             !sourceCode.includes('Map') && 
                             !sourceCode.includes('for');

        return hasMap && hasLoop && hasComplement && hasReturn && !isSimpleWrong;
    }

    /**
     * Calculate two-sum result (correct algorithm)
     * @param {Array} nums - Array of numbers
     * @param {number} target - Target sum
     * @returns {Array} Indices of two numbers that sum to target
     */
    calculateTwoSum(nums, target) {
        const map = new Map();
        for (let i = 0; i < nums.length; i++) {
            const complement = target - nums[i];
            if (map.has(complement)) {
                return [map.get(complement), i];
            }
            map.set(nums[i], i);
        }
        return [];
    }

    /**
     * Check if code has syntax errors
     * @param {string} sourceCode - The JavaScript source code
     * @returns {boolean} True if code has syntax errors
     */
    hasSyntaxError(sourceCode) {
        try {
            new Function(sourceCode);
            return false;
        } catch (error) {
            return error instanceof SyntaxError;
        }
    }
}

module.exports = { MockExecutorService };

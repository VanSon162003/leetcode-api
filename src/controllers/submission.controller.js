const { SubmissionService } = require("../services/submission.service.js");
const { TestCaseValidationService } = require("../services/testcase-validation.service.js");
const { StatusCodes } = require("http-status-codes");
const { validateSubmission, validateTestCasesSubmission } = require("../validators/submission.validator.js");

class SubmissionController {
    constructor() {
        this.submissionService = new SubmissionService();
        this.testCaseValidationService = new TestCaseValidationService();
    }

    submitCode = async (req, res) => {
        try {
            console.log("Received submission request:", req.body);
            
            // Validate request body
            const { error } = validateSubmission(req.body);
            if (error) {
                console.log("Validation error:", error.details[0].message);
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    error: error.details[0].message,
                    details: error.details
                });
            }

            const { source_code, language_id, stdin, testCases, problemId } = req.body;

            // Submit code for execution
            const submission = await this.submissionService.submit({
                source_code,
                language_id,
                stdin,
                testCases,
                problemId
            });

            console.log("Submission successful:", submission);

            res.status(StatusCodes.CREATED).json({
                success: true,
                message: "Code submitted successfully",
                data: submission
            });
        } catch (error) {
            console.error("Error in submitCode:", error);
            
            // Handle specific error types
            if (error.message.includes("Unsupported language")) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    error: error.message,
                    supportedLanguages: this.submissionService.getSupportedLanguages()
                });
            }
            
            if (error.message.includes("Source code cannot be empty")) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Failed to submit code",
                message: error.message
            });
        }
    };

    getSubmission = async (req, res) => {
        try {
            const { token } = req.params;
            
            if (!token) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    error: "Submission token is required"
                });
            }

            console.log(`Fetching submission result for token: ${token}`);

            const submission = await this.submissionService.getSubmission(token);

            if (!submission) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: "Submission not found"
                });
            }

            res.status(StatusCodes.OK).json({
                success: true,
                message: "Submission result retrieved successfully",
                data: submission
            });
        } catch (error) {
            console.error("Error in getSubmission:", error);
            
            if (error.message.includes("Submission not found")) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Failed to fetch submission result",
                message: error.message
            });
        }
    };

    // Get supported programming languages
    getSupportedLanguages = async (req, res) => {
        try {
            const languages = this.submissionService.getSupportedLanguages();
            
            res.status(StatusCodes.OK).json({
                success: true,
                message: "Supported languages retrieved successfully",
                data: {
                    count: Object.keys(languages).length,
                    languages: languages
                }
            });
        } catch (error) {
            console.error("Error in getSupportedLanguages:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Failed to retrieve supported languages",
                message: error.message
            });
        }
    };

    // Health check for Judge0 service
    healthCheck = async (req, res) => {
        try {
            const health = await this.submissionService.healthCheck();
            
            if (health.status === "healthy") {
                res.status(StatusCodes.OK).json({
                    success: true,
                    message: "Judge0 service is healthy",
                    data: health
                });
            } else {
                res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
                    success: false,
                    message: "Judge0 service is unhealthy",
                    data: health
                });
            }
        } catch (error) {
            console.error("Error in healthCheck:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Failed to check Judge0 service health",
                message: error.message
            });
        }
    };

    // Submit code with test cases
    submitWithTestCases = async (req, res) => {
        try {
            console.log("Received submission with test cases request:", req.body);
            
            // Validate request body using specific validator
            const { error } = validateTestCasesSubmission(req.body);
            if (error) {
                console.log("Validation error:", error.details[0].message);
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    error: error.details[0].message,
                    details: error.details
                });
            }

            const { source_code, language_id, testCases, problemId } = req.body;

            const submission = await this.submissionService.submit({
                source_code,
                language_id,
                testCases,
                problemId
            });

            console.log("Submission with test cases successful:", submission);

            res.status(StatusCodes.CREATED).json({
                success: true,
                message: "Code submitted with test cases successfully",
                data: submission
            });
        } catch (error) {
            console.error("Error in submitWithTestCases:", error);
            
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Failed to submit code with test cases",
                message: error.message
            });
        }
    };

    // Validate code against test cases and return detailed results
    validateCode = async (req, res) => {
        try {
            console.log("Received code validation request:", req.body);
            
            // Validate request body
            const { error } = validateTestCasesSubmission(req.body);
            if (error) {
                console.log("Validation error:", error.details[0].message);
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    error: error.details[0].message,
                    details: error.details
                });
            }

            const { source_code, language_id, testCases, problemId } = req.body;

            console.log(`Starting validation for problem: ${problemId} with ${testCases.length} test cases`);

            // Validate code against test cases
            const validationResult = await this.testCaseValidationService.validateCodeWithTestCases(
                source_code,
                language_id,
                testCases,
                problemId
            );

            console.log("Validation completed:", validationResult.summary);

            // Determine response status based on results
            const statusCode = validationResult.success && validationResult.summary.allPassed 
                ? StatusCodes.OK 
                : StatusCodes.BAD_REQUEST;

            res.status(statusCode).json({
                success: validationResult.success && validationResult.summary.allPassed,
                message: validationResult.message,
                data: {
                    problemId: validationResult.problemId,
                    summary: validationResult.summary,
                    results: validationResult.results,
                    passed: validationResult.summary.allPassed
                }
            });

        } catch (error) {
            console.error("Error in validateCode:", error);
            
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Failed to validate code",
                message: error.message
            });
        }
    };
}

module.exports = { SubmissionController };

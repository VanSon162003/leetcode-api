const { StatusCodes } = require("http-status-codes");
const { ProblemService } = require("../services/problem.service.js");
const { validateProblem } = require("../validators/problem.validator.js");

class ProblemController {
    constructor() {
        this.problemService = new ProblemService();
    }

    createProblem = async (req, res) => {
        try {
            const { error } = validateProblem(req.body);
            if (error) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: error.details[0].message,
                });
            }

            const problem = await this.problemService.createProblem(req.body);
            res.status(StatusCodes.CREATED).json(problem);
        } catch (error) {
            console.error("Error in createProblem:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "An error occurred while creating the problem",
            });
        }
    };

    getProblem = async (req, res) => {
        try {
            const { id } = req.params;
            const problem = await this.problemService.getProblem(id);

            if (!problem) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    error: "Problem not found",
                });
            }

            res.status(StatusCodes.OK).json(problem);
        } catch (error) {
            console.error("Error in getProblem:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "An error occurred while fetching the problem",
            });
        }
    };

    getAllProblems = async (req, res) => {
        try {
            const { difficulty, categoryId, limit, offset } = req.query;
            const options = { difficulty, categoryId, limit, offset };
            const problems = await this.problemService.getAllProblems(options);
            res.status(StatusCodes.OK).json(problems);
        } catch (error) {
            console.error("Error in getAllProblems:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "An error occurred while fetching problems",
            });
        }
    };

    updateProblem = async (req, res) => {
        try {
            const { id } = req.params;
            const { error } = validateProblem(req.body);
            if (error) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: error.details[0].message,
                });
            }

            const problem = await this.problemService.updateProblem(id, req.body);
            if (!problem) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    error: "Problem not found",
                });
            }

            res.status(StatusCodes.OK).json(problem);
        } catch (error) {
            console.error("Error in updateProblem:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "An error occurred while updating the problem",
            });
        }
    };

    deleteProblem = async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await this.problemService.deleteProblem(id);

            if (!deleted) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    error: "Problem not found",
                });
            }

            res.status(StatusCodes.NO_CONTENT).send();
        } catch (error) {
            console.error("Error in deleteProblem:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "An error occurred while deleting the problem",
            });
        }
    };
}

module.exports = { ProblemController };

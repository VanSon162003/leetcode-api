const { StatusCodes } = require("http-status-codes");
const { UserProblemService } = require("../services/user-problem.service.js");

class UserProblemController {
    constructor() {
        this.userProblemService = new UserProblemService();
    }

    getUserProblems = async (req, res) => {
        try {
            const { userId } = req.params;
            const { status, limit, offset } = req.query;

            const options = { status, limit, offset };
            const result = await this.userProblemService.getUserProblems(userId, options);
            
            res.status(StatusCodes.OK).json(result);
        } catch (error) {
            console.error("Error in getUserProblems:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: error.message,
            });
        }
    };

    getUserProblem = async (req, res) => {
        try {
            const { userId, problemId } = req.params;
            const userProblem = await this.userProblemService.getUserProblem(userId, problemId);
            
            if (!userProblem) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    error: "User problem not found",
                });
            }

            res.status(StatusCodes.OK).json(userProblem);
        } catch (error) {
            console.error("Error in getUserProblem:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: error.message,
            });
        }
    };

    startProblem = async (req, res) => {
        try {
            const { userId, problemId } = req.params;
            const userProblem = await this.userProblemService.startProblem(userId, problemId);
            
            res.status(StatusCodes.OK).json({
                message: 'Problem started successfully',
                userProblem
            });
        } catch (error) {
            console.error("Error in startProblem:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: error.message,
            });
        }
    };

    updateProblemProgress = async (req, res) => {
        try {
            const { userId, problemId } = req.params;
            const submissionResult = req.body;
            
            const userProblem = await this.userProblemService.updateProblemProgress(
                userId, 
                problemId, 
                submissionResult
            );
            
            res.status(StatusCodes.OK).json({
                message: 'Problem progress updated successfully',
                userProblem
            });
        } catch (error) {
            console.error("Error in updateProblemProgress:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: error.message,
            });
        }
    };

    getProblemStats = async (req, res) => {
        try {
            const { problemId } = req.params;
            const stats = await this.userProblemService.getProblemStats(problemId);
            
            res.status(StatusCodes.OK).json(stats);
        } catch (error) {
            console.error("Error in getProblemStats:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: error.message,
            });
        }
    };

    getUserStats = async (req, res) => {
        try {
            const { userId } = req.params;
            const stats = await this.userProblemService.getUserStats(userId);
            
            res.status(StatusCodes.OK).json(stats);
        } catch (error) {
            console.error("Error in getUserStats:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: error.message,
            });
        }
    };
}

module.exports = { UserProblemController };



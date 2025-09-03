const express = require("express");
const { UserProblemController } = require("../controllers/user-problem.controller.js");
const { AuthMiddleware } = require("../middleware/auth.middleware.js");

const router = express.Router();
const userProblemController = new UserProblemController();
const authMiddleware = new AuthMiddleware();

// All routes require authentication
router.use(authMiddleware.authenticate);

// User Problems routes
router.get("/:userId", userProblemController.getUserProblems);
router.get("/:userId/:problemId", userProblemController.getUserProblem);
router.post("/:userId/:problemId/start", userProblemController.startProblem);
router.put("/:userId/:problemId/progress", userProblemController.updateProblemProgress);
router.get("/:userId/stats", userProblemController.getUserStats);

// Problem stats (public but with auth for better tracking)
router.get("/problem/:problemId/stats", userProblemController.getProblemStats);

module.exports = { userProblemRoutes: router };



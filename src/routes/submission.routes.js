import express from "express";
import { SubmissionController } from "../controllers/submission.controller.js";

const router = express.Router();
const submissionController = new SubmissionController();

// Submit code for execution
router.post("/" ,submissionController.submitCode);

// Submit code with test cases
router.post("/test-cases", submissionController.submitWithTestCases);

// Get supported programming languages
router.get("/languages", submissionController.getSupportedLanguages);

// Health check for Judge0 service
router.get("/health/judge0", submissionController.healthCheck);

// Get submission status and results
router.get("/:token", submissionController.getSubmission);

export { router as submissionRoutes };

import express from "express";
import { ProblemController } from "../controllers/problem.controller.js";

const router = express.Router();
const problemController = new ProblemController();

// Get all problems
router.get("/", problemController.getAllProblems);

// Get a specific problem
router.get("/:id", problemController.getProblem);

// Create a new problem
router.post("/", problemController.createProblem);

// Update a problem
router.put("/:id", problemController.updateProblem);

// Delete a problem
router.delete("/:id", problemController.deleteProblem);

export { router as problemRoutes };

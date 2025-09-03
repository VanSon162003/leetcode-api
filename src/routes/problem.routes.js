const express = require("express");
const { ProblemController } = require("../controllers/problem.controller.js");

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

module.exports = { problemRoutes: router };

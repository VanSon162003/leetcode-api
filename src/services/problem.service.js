import { Problem } from "../models/problem.model.js";

export class ProblemService {
    constructor() {
        // In a real application, this would be stored in a database
        this.problems = new Map();
    }

    createProblem(problemData) {
        const problem = new Problem(problemData);
        this.problems.set(problem.id, problem);
        return problem;
    }

    getProblem(id) {
        return this.problems.get(id);
    }

    getAllProblems() {
        return Array.from(this.problems.values());
    }

    updateProblem(id, problemData) {
        if (!this.problems.has(id)) {
            return null;
        }
        const updatedProblem = new Problem({
            ...this.problems.get(id),
            ...problemData,
        });
        this.problems.set(id, updatedProblem);
        return updatedProblem;
    }

    deleteProblem(id) {
        return this.problems.delete(id);
    }

    validateTestCases(problemId, submission) {
        const problem = this.getProblem(problemId);
        if (!problem) {
            throw new Error("Problem not found");
        }

        return problem.testCases.map((testCase) => {
            // In a real application, you would run the code against each test case
            // using the Judge0 API and compare the results
            return {
                passed: true, // placeholder
                input: testCase.input,
                expectedOutput: testCase.output,
                actualOutput: null, // would be filled with actual output
                executionTime: null,
                memoryUsed: null,
            };
        });
    }
}

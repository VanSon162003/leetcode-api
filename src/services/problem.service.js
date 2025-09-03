const { Problem, TestCase, Category } = require("../models/index.js");

class ProblemService {
    constructor() {
        // Database operations using Sequelize models
    }

    async createProblem(problemData) {
        try {
            const problem = await Problem.create(problemData);
            return problem;
        } catch (error) {
            throw new Error(`Failed to create problem: ${error.message}`);
        }
    }

    async getProblem(id) {
        try {
            const problem = await Problem.findByPk(id, {
                include: [
                    {
                        model: Category,
                        as: 'category'
                    },
                    {
                        model: TestCase,
                        as: 'testCases',
                        where: { isHidden: false },
                        required: false
                    }
                ]
            });
            return problem;
        } catch (error) {
            throw new Error(`Failed to get problem: ${error.message}`);
        }
    }

    async getAllProblems(options = {}) {
        try {
            const { difficulty, categoryId, limit = 50, offset = 0 } = options;
            
            const whereClause = {};
            if (difficulty) whereClause.difficulty = difficulty;
            if (categoryId) whereClause.categoryId = categoryId;
            whereClause.isActive = true;

            const problems = await Problem.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: Category,
                        as: 'category'
                    }
                ],
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['createdAt', 'DESC']]
            });
            
            return problems;
        } catch (error) {
            throw new Error(`Failed to get problems: ${error.message}`);
        }
    }

    async updateProblem(id, problemData) {
        try {
            const [updatedRowsCount] = await Problem.update(problemData, {
                where: { id }
            });
            
            if (updatedRowsCount === 0) {
                return null;
            }
            
            const updatedProblem = await this.getProblem(id);
            return updatedProblem;
        } catch (error) {
            throw new Error(`Failed to update problem: ${error.message}`);
        }
    }

    async deleteProblem(id) {
        try {
            const deletedRowsCount = await Problem.destroy({
                where: { id }
            });
            
            return deletedRowsCount > 0;
        } catch (error) {
            throw new Error(`Failed to delete problem: ${error.message}`);
        }
    }

    async validateTestCases(problemId, submission) {
        try {
            const problem = await Problem.findByPk(problemId, {
                include: [
                    {
                        model: TestCase,
                        as: 'testCases',
                        order: [['order', 'ASC']]
                    }
                ]
            });
            
            if (!problem) {
                throw new Error("Problem not found");
            }

            return problem.testCases.map((testCase) => {
                // In a real application, you would run the code against each test case
                // using the Judge0 API and compare the results
                return {
                    passed: true, // placeholder
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    actualOutput: null, // would be filled with actual output
                    executionTime: null,
                    memoryUsed: null,
                };
            });
        } catch (error) {
            throw new Error(`Failed to validate test cases: ${error.message}`);
        }
    }

    async getProblemBySlug(slug) {
        try {
            const problem = await Problem.findOne({
                where: { slug },
                include: [
                    {
                        model: Category,
                        as: 'category'
                    },
                    {
                        model: TestCase,
                        as: 'testCases',
                        where: { isHidden: false },
                        required: false
                    }
                ]
            });
            return problem;
        } catch (error) {
            throw new Error(`Failed to get problem by slug: ${error.message}`);
        }
    }
}

module.exports = { ProblemService };

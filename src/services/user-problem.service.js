const { UserProblem, Problem, User, Category } = require('../models/index.js');

class UserProblemService {
    constructor() {
        // Database operations using Sequelize models
    }

    async getUserProblems(userId, options = {}) {
        try {
            const { status, limit = 50, offset = 0 } = options;
            
            const whereClause = { userId };
            if (status) whereClause.status = status;

            const userProblems = await UserProblem.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: Problem,
                        as: 'problem',
                        include: [
                            {
                                model: Category,
                                as: 'category'
                            }
                        ]
                    }
                ],
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['updatedAt', 'DESC']]
            });
            
            return userProblems;
        } catch (error) {
            throw new Error(`Failed to get user problems: ${error.message}`);
        }
    }

    async getUserProblem(userId, problemId) {
        try {
            const userProblem = await UserProblem.findOne({
                where: { userId, problemId },
                include: [
                    {
                        model: Problem,
                        as: 'problem',
                        include: [
                            {
                                model: Category,
                                as: 'category'
                            }
                        ]
                    }
                ]
            });
            
            return userProblem;
        } catch (error) {
            throw new Error(`Failed to get user problem: ${error.message}`);
        }
    }

    async startProblem(userId, problemId) {
        try {
            // Check if user-problem relationship already exists
            let userProblem = await UserProblem.findOne({
                where: { userId, problemId }
            });

            if (userProblem) {
                // Update status to In Progress if it's Not Started
                if (userProblem.status === 'Not Started') {
                    userProblem = await userProblem.update({
                        status: 'In Progress',
                        lastAttemptAt: new Date()
                    });
                }
            } else {
                // Create new user-problem relationship
                userProblem = await UserProblem.create({
                    userId,
                    problemId,
                    status: 'In Progress',
                    attempts: 0,
                    lastAttemptAt: new Date()
                });
            }

            return userProblem;
        } catch (error) {
            throw new Error(`Failed to start problem: ${error.message}`);
        }
    }

    async updateProblemProgress(userId, problemId, submissionResult) {
        try {
            const { status, executionTime, memoryUsed, score } = submissionResult;
            
            let userProblem = await UserProblem.findOne({
                where: { userId, problemId }
            });

            if (!userProblem) {
                // Create new user-problem relationship
                userProblem = await UserProblem.create({
                    userId,
                    problemId,
                    status: 'In Progress',
                    attempts: 1,
                    lastAttemptAt: new Date()
                });
            } else {
                // Update existing relationship
                const updateData = {
                    attempts: userProblem.attempts + 1,
                    lastAttemptAt: new Date()
                };

                // Update best scores if this attempt is better
                if (score && (!userProblem.bestScore || score > userProblem.bestScore)) {
                    updateData.bestScore = score;
                }

                if (executionTime && (!userProblem.bestExecutionTime || executionTime < userProblem.bestExecutionTime)) {
                    updateData.bestExecutionTime = executionTime;
                }

                if (memoryUsed && (!userProblem.bestMemoryUsed || memoryUsed < userProblem.bestMemoryUsed)) {
                    updateData.bestMemoryUsed = memoryUsed;
                }

                // Update status based on submission result
                if (status === 'Accepted') {
                    updateData.status = 'Completed';
                    updateData.completedAt = new Date();
                } else if (userProblem.status === 'Not Started') {
                    updateData.status = 'In Progress';
                }

                userProblem = await userProblem.update(updateData);
            }

            return userProblem;
        } catch (error) {
            throw new Error(`Failed to update problem progress: ${error.message}`);
        }
    }

    async getProblemStats(problemId) {
        try {
            const stats = await UserProblem.findAll({
                where: { problemId },
                attributes: [
                    'status',
                    [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
                ],
                group: ['status'],
                raw: true
            });

            const totalAttempts = await UserProblem.sum('attempts', {
                where: { problemId }
            });

            const avgScore = await UserProblem.findOne({
                where: { 
                    problemId,
                    bestScore: { [require('sequelize').Op.ne]: null }
                },
                attributes: [
                    [require('sequelize').fn('AVG', require('sequelize').col('bestScore')), 'avgScore']
                ],
                raw: true
            });

            return {
                statusDistribution: stats,
                totalAttempts: totalAttempts || 0,
                averageScore: avgScore?.avgScore || 0
            };
        } catch (error) {
            throw new Error(`Failed to get problem stats: ${error.message}`);
        }
    }

    async getUserStats(userId) {
        try {
            const stats = await UserProblem.findAll({
                where: { userId },
                attributes: [
                    'status',
                    [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
                ],
                group: ['status'],
                raw: true
            });

            const totalAttempts = await UserProblem.sum('attempts', {
                where: { userId }
            });

            const completedProblems = await UserProblem.count({
                where: { 
                    userId,
                    status: 'Completed'
                }
            });

            const totalProblems = await Problem.count();

            return {
                statusDistribution: stats,
                totalAttempts: totalAttempts || 0,
                completedProblems,
                totalProblems,
                completionRate: totalProblems > 0 ? (completedProblems / totalProblems * 100).toFixed(2) : 0
            };
        } catch (error) {
            throw new Error(`Failed to get user stats: ${error.message}`);
        }
    }
}

module.exports = { UserProblemService };

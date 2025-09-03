const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.js');

const UserProblem = sequelize.define('UserProblem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  problemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Problems',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('Not Started', 'In Progress', 'Completed'),
    allowNull: false,
    defaultValue: 'Not Started'
  },
  attempts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Number of attempts made'
  },
  bestScore: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Best score achieved (percentage)'
  },
  bestExecutionTime: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Best execution time in milliseconds'
  },
  bestMemoryUsed: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Best memory used in KB'
  },
  lastAttemptAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'UserProblems',
  timestamps: true
});

module.exports = UserProblem;


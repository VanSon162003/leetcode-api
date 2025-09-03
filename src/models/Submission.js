const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.js');

const Submission = sequelize.define('Submission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  problemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Problems',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  code: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  language: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'Programming language (javascript, python, java, etc.)'
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Memory Limit Exceeded', 'Runtime Error', 'Compilation Error'),
    allowNull: false,
    defaultValue: 'Pending'
  },
  executionTime: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Execution time in milliseconds'
  },
  memoryUsed: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Memory used in KB'
  },
  testResults: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Detailed test case results'
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  submittedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Submissions',
  timestamps: true
});

module.exports = Submission;

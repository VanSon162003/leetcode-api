const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.js');

const TestCase = sequelize.define('TestCase', {
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
  input: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  expectedOutput: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isHidden: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Hidden test cases are not shown to users'
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Order of test case execution'
  }
}, {
  tableName: 'TestCases',
  timestamps: true
});

module.exports = TestCase;

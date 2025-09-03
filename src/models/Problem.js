const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.js');

const Problem = sequelize.define('Problem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  difficulty: {
    type: DataTypes.ENUM('Easy', 'Medium', 'Hard'),
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Categories',
      key: 'id'
    }
  },
  timeLimit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2,
    comment: 'Time limit in seconds'
  },
  memoryLimit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 128,
    comment: 'Memory limit in MB'
  },
  starterCode: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Starter code for different languages'
  },
  hints: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'Problems',
  timestamps: true
});

module.exports = Problem;

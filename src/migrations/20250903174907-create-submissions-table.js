'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Submissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      problemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Problems',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      code: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      language: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: 'Programming language (javascript, python, java, etc.)'
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Memory Limit Exceeded', 'Runtime Error', 'Compilation Error'),
        allowNull: false,
        defaultValue: 'Pending'
      },
      executionTime: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Execution time in milliseconds'
      },
      memoryUsed: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Memory used in KB'
      },
      testResults: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Detailed test case results'
      },
      errorMessage: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      submittedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Submissions');
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('UserProblems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      status: {
        type: Sequelize.ENUM('Not Started', 'In Progress', 'Completed'),
        allowNull: false,
        defaultValue: 'Not Started'
      },
      attempts: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of attempts made'
      },
      bestScore: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Best score achieved (percentage)'
      },
      bestExecutionTime: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Best execution time in milliseconds'
      },
      bestMemoryUsed: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Best memory used in KB'
      },
      lastAttemptAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      completedAt: {
        type: Sequelize.DATE,
        allowNull: true
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

    // Add unique constraint to prevent duplicate user-problem pairs
    await queryInterface.addConstraint('UserProblems', {
      fields: ['userId', 'problemId'],
      type: 'unique',
      name: 'unique_user_problem'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('UserProblems');
  }
};

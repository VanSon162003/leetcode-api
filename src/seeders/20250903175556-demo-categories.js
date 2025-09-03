'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      {
        name: 'Array',
        description: 'Problems related to arrays and list manipulation',
        slug: 'array',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'String',
        description: 'Problems involving string manipulation and algorithms',
        slug: 'string',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Linked List',
        description: 'Problems with linked list data structures',
        slug: 'linked-list',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Tree',
        description: 'Binary tree and tree traversal problems',
        slug: 'tree',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dynamic Programming',
        description: 'Dynamic programming and optimization problems',
        slug: 'dynamic-programming',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Graph',
        description: 'Graph algorithms and traversal problems',
        slug: 'graph',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};

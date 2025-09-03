'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Get category IDs
    const categories = await queryInterface.sequelize.query(
      'SELECT id, name FROM Categories',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    await queryInterface.bulkInsert('Problems', [
      {
        title: 'Two Sum',
        slug: 'two-sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        difficulty: 'Easy',
        categoryId: categoryMap['Array'],
        timeLimit: 2,
        memoryLimit: 128,
        starterCode: JSON.stringify({
          javascript: 'function twoSum(nums, target) {\n    // Your code here\n}',
          python: 'def twoSum(nums, target):\n    # Your code here\n    pass'
        }),
        hints: 'You can use a hash map to store the complement of each number.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Valid Parentheses',
        slug: 'valid-parentheses',
        description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
        difficulty: 'Easy',
        categoryId: categoryMap['String'],
        timeLimit: 2,
        memoryLimit: 128,
        starterCode: JSON.stringify({
          javascript: 'function isValid(s) {\n    // Your code here\n}',
          python: 'def isValid(s):\n    # Your code here\n    pass'
        }),
        hints: 'Use a stack to keep track of opening brackets.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Maximum Subarray',
        slug: 'maximum-subarray',
        description: 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
        difficulty: 'Medium',
        categoryId: categoryMap['Dynamic Programming'],
        timeLimit: 2,
        memoryLimit: 128,
        starterCode: JSON.stringify({
          javascript: 'function maxSubArray(nums) {\n    // Your code here\n}',
          python: 'def maxSubArray(nums):\n    # Your code here\n    pass'
        }),
        hints: 'Use Kadane\'s algorithm to solve this in O(n) time.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // Get problem IDs
    const problems = await queryInterface.sequelize.query(
      'SELECT id, slug FROM Problems',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    const problemMap = {};
    problems.forEach(prob => {
      problemMap[prob.slug] = prob.id;
    });

    // Add test cases for the problems
    await queryInterface.bulkInsert('TestCases', [
      // Test cases for Two Sum
      {
        problemId: problemMap['two-sum'],
        input: '[2,7,11,15]',
        expectedOutput: '[0,1]',
        isHidden: false,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        problemId: problemMap['two-sum'],
        input: '[3,2,4]',
        expectedOutput: '[1,2]',
        isHidden: false,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        problemId: problemMap['two-sum'],
        input: '[3,3]',
        expectedOutput: '[0,1]',
        isHidden: true,
        order: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Test cases for Valid Parentheses
      {
        problemId: problemMap['valid-parentheses'],
        input: '"()"',
        expectedOutput: 'true',
        isHidden: false,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        problemId: problemMap['valid-parentheses'],
        input: '"()[]{}"',
        expectedOutput: 'true',
        isHidden: false,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        problemId: problemMap['valid-parentheses'],
        input: '"(]"',
        expectedOutput: 'false',
        isHidden: false,
        order: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Test cases for Maximum Subarray
      {
        problemId: problemMap['maximum-subarray'],
        input: '[-2,1,-3,4,-1,2,1,-5,4]',
        expectedOutput: '6',
        isHidden: false,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        problemId: problemMap['maximum-subarray'],
        input: '[1]',
        expectedOutput: '1',
        isHidden: false,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        problemId: problemMap['maximum-subarray'],
        input: '[5,4,-1,7,8]',
        expectedOutput: '23',
        isHidden: true,
        order: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('TestCases', null, {});
    await queryInterface.bulkDelete('Problems', null, {});
  }
};

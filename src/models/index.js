const sequelize = require('../config/sequelize.js');
const Category = require('./Category.js');
const Problem = require('./Problem.js');
const TestCase = require('./TestCase.js');
const User = require('./User.js');
const Submission = require('./Submission.js');
const UserProblem = require('./UserProblem.js');

// Define associations
Category.hasMany(Problem, { 
  foreignKey: 'categoryId', 
  as: 'problems' 
});
Problem.belongsTo(Category, { 
  foreignKey: 'categoryId', 
  as: 'category' 
});

Problem.hasMany(TestCase, { 
  foreignKey: 'problemId', 
  as: 'testCases' 
});
TestCase.belongsTo(Problem, { 
  foreignKey: 'problemId', 
  as: 'problem' 
});

Problem.hasMany(Submission, { 
  foreignKey: 'problemId', 
  as: 'submissions' 
});
Submission.belongsTo(Problem, { 
  foreignKey: 'problemId', 
  as: 'problem' 
});

User.hasMany(Submission, { 
  foreignKey: 'userId', 
  as: 'submissions' 
});
Submission.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'user' 
});

// User-Problem many-to-many relationship
User.belongsToMany(Problem, {
  through: UserProblem,
  foreignKey: 'userId',
  otherKey: 'problemId',
  as: 'problems'
});

Problem.belongsToMany(User, {
  through: UserProblem,
  foreignKey: 'problemId',
  otherKey: 'userId',
  as: 'users'
});

UserProblem.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

UserProblem.belongsTo(Problem, {
  foreignKey: 'problemId',
  as: 'problem'
});

User.hasMany(UserProblem, {
  foreignKey: 'userId',
  as: 'userProblems'
});

Problem.hasMany(UserProblem, {
  foreignKey: 'problemId',
  as: 'userProblems'
});

// Export models and sequelize instance
module.exports = {
  sequelize,
  Category,
  Problem,
  TestCase,
  User,
  Submission,
  UserProblem
};

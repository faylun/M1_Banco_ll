const { Sequelize } = require('sequelize');

// Database connection configuration
const sequelize = new Sequelize('sakila', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize;
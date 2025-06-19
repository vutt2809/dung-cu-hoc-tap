require('dotenv').config();
const chalk = require('chalk');
const { Sequelize } = require('sequelize');

const keys = require('../config/keys');
const { database } = keys;

const sequelize = new Sequelize(
  database.database,
  database.username,
  database.password,
  {
    host: database.host,
    port: database.port,
    dialect: database.dialect,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const setupDB = async () => {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log(`${chalk.green('✓')} ${chalk.blue('MySQL Connected!')}`);

    // Sync all models
    await sequelize.sync({ alter: true });
    console.log(`${chalk.green('✓')} ${chalk.blue('Database synced!')}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return null;
  }
};

module.exports = { setupDB, sequelize };

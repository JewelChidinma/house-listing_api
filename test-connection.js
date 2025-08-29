require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('SUCCESS: Node.js can connect to PostgreSQL!');
    console.log('Your credentials work with Node.js');
    await sequelize.close();
  } catch (error) {
    console.error('FAILED: Node.js cannot connect to PostgreSQL');
    console.error('Error:', error.message);
  }
}

testConnection();
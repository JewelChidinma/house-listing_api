const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: 'STRING', // Our mock DB uses strings
    primaryKey: true
  },
  name: {
    type: 'STRING',
    allowNull: false
  },
  email: {
    type: 'STRING',
    allowNull: false,
    unique: true
  },
  password: {
    type: 'STRING',
    allowNull: false
  }
});

module.exports = User;
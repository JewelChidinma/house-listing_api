const sequelize = require('../config/database');

const listing = sequelize.define('listing', {
  id: {
    type: 'STRING', // Our mock DB uses strings
    primaryKey: true
  },
  owner_id: {
    type: 'STRING',
    allowNull: false
  },
  title: {
    type: 'STRING',
    allowNull: false
  },
  description: {
    type: 'STRING',
    allowNull: false
  },
  price: {
    type: 'INTEGER',
    allowNull: false
  },
  currency: {
    type: 'STRING',
    defaultValue: 'NGN'
  },
  property_type: {
    type: 'STRING', // apartment|house|studio|duplex|land
    allowNull: false
  },
  bedrooms: {
    type: 'INTEGER',
    defaultValue: 0
  },
  bathrooms: {
    type: 'INTEGER',
    defaultValue: 0
  },
  area_sqm: {
    type: 'INTEGER',
    defaultValue: 0
  },
  city: {
    type: 'STRING',
    allowNull: false
  },
  state: {
    type: 'STRING',
    allowNull: false
  },
  country: {
    type: 'STRING',
    defaultValue: 'Nigeria'
  },
  address: {
    type: 'STRING',
    allowNull: false
  },
  amenities: {
    type: 'JSON', // Array of strings
    defaultValue: []
  },
  images: {
    type: 'JSON', // Array of URLs
    defaultValue: []
  },
  status: {
    type: 'STRING', // active|inactive
    defaultValue: 'active'
  }
});

module.exports = listing;
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route to test server
app.get('/', (req, res) => {
  res.json({ message: 'House Listing API is running!' });
});

// Routes (we'll add these later)
// app.use('/auth', require('./routes/auth'));
// app.use('/listings', require('./routes/listings'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
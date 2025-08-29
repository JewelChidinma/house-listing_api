const express = require('express');
const sequelize = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
  res.json({ message: 'House Listing API is running!' });
});

// Auth routes
app.use('/auth', require('./routes/auth'));

// Listings routes
app.use('/listings', require('./routes/listings'));

// Start server
async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync database
    await sequelize.sync({ force: false });
    console.log('Database synced successfully.');

    // Seed database with sample data
    const { seedDatabase } = require('./seeders/seed');
    await seedDatabase();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Test the API:`);
      console.log(`POST http://localhost:${PORT}/auth/login`);
      console.log(`{"email": "demo@user.com", "password": "password123"}`);
      console.log(`GET http://localhost:${PORT}/listings`);
    });
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

startServer();
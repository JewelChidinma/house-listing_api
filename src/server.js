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

// Start server
async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync database
    await sequelize.sync({ force: false });
    console.log('Database synced successfully.');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

startServer();
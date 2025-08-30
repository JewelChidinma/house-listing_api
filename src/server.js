const express = require('express');
const { connectDB } = require('./config/database');
require('dotenv').config();

console.log('Starting server...');
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');

const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

// Basic middleware
//app.use(express.json());
app.use(express.json({
  type: (req) => {
    return req.method !== 'GET' && req.headers['content-type'] === 'application/json';
  }
}));


// Simple test route
app.get('/', (req, res) => {
  res.json({ message: 'House Listing API is running!' });
});

// Auth routes
app.use('/auth', require('./routes/auth'));

// Listings routes
app.use('/listings', require('./routes/listings'));

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});


// Start server
async function startServer() {
  try {
    console.log('Attempting to connect to MongoDB...');
    // Connect to MongoDB
    await connectDB();
    
    console.log('MongoDB connected, about to seed...');
    // Seed database with sample data
    const { seedDatabase } = require('./seeders/seed');
    await seedDatabase();
    console.log('Seeding completed');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

console.log('About to start server function...');
startServer();
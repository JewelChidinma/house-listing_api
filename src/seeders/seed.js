const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Listing = require('../models/listing');

const seedDatabase = async () => {
  try {
    console.log('Seeding database...');

    const existingUser = await User.findOne({email: process.env.DEMO_USER_EMAIL});
    if (existingUser) {
      console.log('Data already exists, skipping seed');
      return;
    }

    const hashed = await bcrypt.hash(process.env.DEMO_USER_PASSWORD, 10);
    const demoUser = await User.create({
      name: 'Demo User',
      email: process.env.DEMO_USER_EMAIL,
      password: hashed
    });
    console.log('Demo user created successfully');

    const cities = [
      { city: 'Lagos', state: 'Lagos' },
      { city: 'Abuja', state: 'FCT' },
      { city: 'Port Harcourt', state: 'Rivers' },
      { city: 'Kano', state: 'Kano' }
    ];
    const types = ['apartment','house','studio','duplex','land'];
    const amenityPool = ['parking','wifi','security','generator','pool','gym','garden'];

    const listings = [];
    for (let i = 1; i <= 30; i++) {
      const loc = cities[i % cities.length];
      const type = types[i % types.length];
      const ams = amenityPool.filter((_, idx) => (i + idx) % 3 === 0);
      listings.push({
        ownerId: demoUser._id,
        title: `Sample ${type} ${i} in ${loc.city}`,
        description: `Nice ${type} number ${i} located in ${loc.city}.`,
        price: 150000 + i * 50000,
        currency: 'NGN',
        propertyType: type,
        bedrooms: (i % 5),
        bathrooms: (i % 3),
        areaSqm: 50 + (i * 3),
        city: loc.city,
        state: loc.state,
        country: 'Nigeria',
        address: `${10 + i} Example Street, ${loc.city}`,
        amenities: ams,
        status: 'active'
      });
    }

    await Listing.insertMany(listings);
    console.log(`Created ${listings.length} sample listings`);
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Seed error:', error);
  }
};

module.exports = { seedDatabase };

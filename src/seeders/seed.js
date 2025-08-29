const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
const Listing = require('../models/listing');

const seedDatabase = async () => {
  try {
    console.log('Seeding database...');

    // Create demo user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const demoUser = await User.create({
      id: uuidv4(),
      name: 'Demo User',
      email: 'demo@user.com',
      password: hashedPassword
    });

    console.log('Demo user created: demo@user.com / password123');

    // Create sample listings
    const listings = [
      {
        title: 'Beautiful 3-Bedroom Duplex in Lekki',
        description: 'Modern duplex with spacious rooms, fitted kitchen, and parking space. Perfect for families looking for comfort and style.',
        price: 450000,
        property_type: 'duplex',
        bedrooms: 3,
        bathrooms: 2,
        area_sqm: 150,
        city: 'Lagos',
        state: 'Lagos',
        address: '15 Admiralty Way, Lekki Phase 1',
        amenities: ['parking', 'security', 'generator']
      },
      {
        title: 'Cozy 2-Bedroom Apartment in Ikeja',
        description: 'Affordable apartment with modern amenities and easy access to transport. Great for young professionals.',
        price: 250000,
        property_type: 'apartment',
        bedrooms: 2,
        bathrooms: 1,
        area_sqm: 80,
        city: 'Lagos',
        state: 'Lagos',
        address: '23 Allen Avenue, Ikeja',
        amenities: ['parking', 'wifi']
      },
      {
        title: 'Luxury 4-Bedroom House in Abuja',
        description: 'Spacious family home with garden and swimming pool. Premium location in the heart of the capital.',
        price: 800000,
        property_type: 'house',
        bedrooms: 4,
        bathrooms: 3,
        area_sqm: 250,
        city: 'Abuja',
        state: 'FCT',
        address: '12 Maitama District, Abuja',
        amenities: ['parking', 'pool', 'garden', 'security']
      },
      {
        title: 'Studio Apartment in Victoria Island',
        description: 'Compact and efficient studio in prime location. Perfect for single professionals.',
        price: 180000,
        property_type: 'studio',
        bedrooms: 0,
        bathrooms: 1,
        area_sqm: 45,
        city: 'Lagos',
        state: 'Lagos',
        address: '8 Adeola Odeku Street, Victoria Island',
        amenities: ['wifi', 'security']
      },
      {
        title: 'Spacious 5-Bedroom Duplex in Banana Island',
        description: 'Ultra-luxury duplex with ocean view and top-notch amenities. For those who demand the best.',
        price: 1200000,
        property_type: 'duplex',
        bedrooms: 5,
        bathrooms: 4,
        area_sqm: 300,
        city: 'Lagos',
        state: 'Lagos',
        address: '45 Banana Island Road, Ikoyi',
        amenities: ['parking', 'pool', 'gym', 'security', 'ocean_view']
      },
      {
        title: '3-Bedroom Apartment in Wuse 2',
        description: 'Well-appointed apartment in Abuja commercial district. Close to offices and shopping.',
        price: 400000,
        property_type: 'apartment',
        bedrooms: 3,
        bathrooms: 2,
        area_sqm: 120,
        city: 'Abuja',
        state: 'FCT',
        address: '67 Ademola Adetokunbo Crescent, Wuse 2',
        amenities: ['parking', 'generator', 'security']
      },
      {
        title: 'Land for Sale in Lekki',
        description: 'Prime residential land in fast-developing area. Perfect for building your dream home.',
        price: 300000,
        property_type: 'land',
        bedrooms: 0,
        bathrooms: 0,
        area_sqm: 500,
        city: 'Lagos',
        state: 'Lagos',
        address: 'Plot 23, Block C, Lekki Scheme 2',
        amenities: []
      },
      {
        title: 'Modern 2-Bedroom Flat in Surulere',
        description: 'Contemporary apartment with great natural light and modern fittings.',
        price: 220000,
        property_type: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        area_sqm: 90,
        city: 'Lagos',
        state: 'Lagos',
        address: '34 Adeniran Ogunsanya Street, Surulere',
        amenities: ['parking', 'generator']
      }
    ];

    // Create all listings
    for (const listingData of listings) {
      await Listing.create({
        id: uuidv4(),
        owner_id: demoUser.id,
        ...listingData
      });
    }

    console.log(`Created ${listings.length} sample listings`);
    console.log('Database seeded successfully!');

  } catch (error) {
    console.error('Seed error:', error);
  }
};

module.exports = { seedDatabase };
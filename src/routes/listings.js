const express = require('express');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

const Listing = require('../models/listing');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation schema
const listingSchema = Joi.object({
  title: Joi.string().min(5).max(120).required(),
  description: Joi.string().max(2000).required(),
  price: Joi.number().integer().min(1).required(),
  currency: Joi.string().default('NGN'),
  property_type: Joi.string().valid('apartment', 'house', 'studio', 'duplex', 'land').required(),
  bedrooms: Joi.number().integer().min(0).default(0),
  bathrooms: Joi.number().integer().min(0).default(0),
  area_sqm: Joi.number().integer().min(0).default(0),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().default('Nigeria'),
  address: Joi.string().required(),
  amenities: Joi.array().items(Joi.string()).default([]),
  images: Joi.array().items(Joi.string().uri()).default([]),
  status: Joi.string().valid('active', 'inactive').default('active')
});

const updateListingSchema = listingSchema.fork(
  ['title', 'description', 'price', 'property_type', 'city', 'state', 'address'],
  (schema) => schema.optional()
);

// POST /listings - Create listing (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Validate input
    const { error, value } = listingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Create listing
    const listing = await Listing.create({
      id: uuidv4(),
      owner_id: req.user.id,
      ...value
    });

    res.status(201).json(listing);

  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /listings/:id - Get listing by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findOne({ where: { id: req.params.id } });
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json(listing);

  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /listings/:id - Update listing (protected, owner only)
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    // Find listing
    const listing = await Listing.findOne({ where: { id: req.params.id } });
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Check ownership
    if (listing.owner_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own listings' });
    }

    // Validate input
    const { error, value } = updateListingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Update listing
    await Listing.update(value, { where: { id: req.params.id } });
    
    // Get updated listing
    const updatedListing = await Listing.findOne({ where: { id: req.params.id } });
    
    res.json(updatedListing);

  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /listings/:id - Delete listing (protected, owner only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Find listing
    const listing = await Listing.findOne({ where: { id: req.params.id } });
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Check ownership
    if (listing.owner_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own listings' });
    }

    // Delete listing
    await Listing.destroy({ where: { id: req.params.id } });
    
    res.status(204).send();

  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /listings - Query listings (public) with filters, search, sort, pagination
router.get('/', async (req, res) => {
  try {
    const {
      city,
      state,
      status = 'active',
      property_type,
      bedrooms,
      bathrooms,
      min_price,
      max_price,
      amenities,
      q, // search query
      sort = 'created_at',
      page = 1,
      limit = 20
    } = req.query;

    // Get all listings from our mock database
    const allListings = await Listing.findAll();
    console.log(`Found ${allListings.length} total listings in database`);
    console.log('Sample listing:', allListings[0] ? allListings[0].title : 'No listings found');
    
    // Apply filters
    let filteredListings = allListings.filter(listing => {
      // Status filter
      if (status && listing.status !== status) return false;
      
      // City filter (case insensitive)
      if (city && listing.city.toLowerCase() !== city.toLowerCase()) return false;
      
      // State filter (case insensitive)
      if (state && listing.state.toLowerCase() !== state.toLowerCase()) return false;
      
      // Property type filter
      if (property_type && listing.property_type !== property_type) return false;
      
      // Bedrooms filter
      if (bedrooms && listing.bedrooms !== parseInt(bedrooms)) return false;
      
      // Bathrooms filter
      if (bathrooms && listing.bathrooms !== parseInt(bathrooms)) return false;
      
      // Price range filters
      if (min_price && listing.price < parseInt(min_price)) return false;
      if (max_price && listing.price > parseInt(max_price)) return false;
      
      // Amenities filter (listing must contain ALL requested amenities)
      if (amenities) {
        const requestedAmenities = amenities.split(',').map(a => a.trim());
        const listingAmenities = listing.amenities || [];
        const hasAllAmenities = requestedAmenities.every(amenity => 
          listingAmenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }
      
      // Search filter (search in title OR description, case insensitive)
      if (q) {
        const searchTerm = q.toLowerCase();
        const titleMatch = listing.title.toLowerCase().includes(searchTerm);
        const descriptionMatch = listing.description.toLowerCase().includes(searchTerm);
        if (!titleMatch && !descriptionMatch) return false;
      }
      
      return true;
    });

    // Apply sorting
    const sortFields = sort.split(',');
    filteredListings.sort((a, b) => {
      for (const sortField of sortFields) {
        const isDescending = sortField.startsWith('-');
        const fieldName = isDescending ? sortField.substring(1) : sortField;
        
        let aValue = a[fieldName];
        let bValue = b[fieldName];
        
        // Handle date fields
        if (fieldName.includes('created_at') || fieldName.includes('updated_at')) {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        
        // Handle price (numeric)
        if (fieldName === 'price') {
          aValue = parseInt(aValue);
          bValue = parseInt(bValue);
        }
        
        let comparison = 0;
        if (aValue > bValue) comparison = 1;
        if (aValue < bValue) comparison = -1;
        
        if (comparison !== 0) {
          return isDescending ? -comparison : comparison;
        }
      }
      return 0;
    });

    // Apply pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Max 100 per page
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const paginatedListings = filteredListings.slice(startIndex, endIndex);
    const total = filteredListings.length;
    const totalPages = Math.ceil(total / limitNum);

    // Return paginated response
    res.json({
      data: paginatedListings,
      page: pageNum,
      limit: limitNum,
      total: total,
      totalPages: totalPages
    });

  } catch (error) {
    console.error('Query listings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
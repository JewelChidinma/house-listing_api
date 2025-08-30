const express = require('express');
const Joi = require('joi');
const Listing = require('../models/listing');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const listingSchema = Joi.object({
  title: Joi.string().min(5).max(120).required(),
  description: Joi.string().max(2000).required(),
  price: Joi.number().min(1).required(),
  currency: Joi.string().default('NGN'),
  propertyType: Joi.string().valid('apartment','house','studio','duplex','land').required(),
  bedrooms: Joi.number().min(0).default(0),
  bathrooms: Joi.number().min(0).default(0),
  areaSqm: Joi.number().min(0).default(0),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().default('Nigeria'),
  address: Joi.string().required(),
  amenities: Joi.array().items(Joi.string()).default([]),
  images: Joi.array().items(Joi.string().uri()).default([]),
  status: Joi.string().valid('active','inactive').default('active')
});

const updateListingSchema = listingSchema.fork([
  'title','description','price','currency','propertyType','bedrooms','bathrooms',
  'areaSqm','city','state','country','address','amenities','images','status'
], s => s.optional());

// Post listings
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { error, value } = listingSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const doc = await Listing.create({ ...value, ownerId: req.user.id });
    res.status(201).json(doc);
  } catch (err) {
    console.error('Create listing error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get listings by id
router.get('/:id', async (req, res) => {
  try {
    const doc = await Listing.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Listing not found' });
    res.json(doc);
  } catch (err) {
    console.error('Get listing error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update listings by id 

router.patch("/:id", authenticateToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    // compare both as strings
    if (listing.ownerId.toString() !== String(req.user.id)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    Object.assign(listing, req.body);
    await listing.save();

    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Delete listings by id 
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    if (listing.ownerId.toString() !== String(req.user.id)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await listing.deleteOne();
    res.json({ message: "Listing deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get listings by query endpoint
router.get('/', async (req, res) => {
  try {
    const {
      city, state, status, propertyType, property_type, bedrooms, bathrooms,
      minPrice, min_price, maxPrice, max_price,
      amenities, q, sort = 'createdAt', page = 1, limit = 20
    } = req.query;

    const filter = {};
    if (city) filter.city = city;
    if (state) filter.state = state;
    if (status) filter.status = status;
    const type = propertyType || property_type;
    if (type) filter.propertyType = type;
    if (bedrooms !== undefined) filter.bedrooms = +bedrooms;
    if (bathrooms !== undefined) filter.bathrooms = +bathrooms;

    const minP = minPrice ?? min_price;
    const maxP = maxPrice ?? max_price;
    if (minP || maxP) {
      filter.price = {};
      if (minP) filter.price.$gte = +minP;
      if (maxP) filter.price.$lte = +maxP;
    }

    if (amenities) filter.amenities = { $all: amenities.split(',').map(a => a.trim()) };

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    // Sorting: allow price and createdAt
    let sortSpec = {};
    sort.split(',').forEach(s => {
      const desc = s.startsWith('-');
      const key = desc ? s.slice(1) : s;
      if (['price', 'createdAt'].includes(key)) sortSpec[key] = desc ? -1 : 1;
    });
    if (Object.keys(sortSpec).length === 0) sortSpec = { createdAt: 1 };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [total, data] = await Promise.all([
      Listing.countDocuments(filter),
      Listing.find(filter).sort(sortSpec).skip(skip).limit(limitNum)
    ]);

    res.json({
      data,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (err) {
    console.error('Query listings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

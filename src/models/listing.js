const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 120,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 1
  },
  currency: {
    type: String,
    default: 'NGN'
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['apartment', 'house', 'studio', 'duplex', 'land']
  },
  bedrooms: {
    type: Number,
    default: 0,
    min: 0
  },
  bathrooms: {
    type: Number,
    default: 0,
    min: 0
  },
  areaSqm: {
    type: Number,
    default: 0,
    min: 0
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    default: 'Nigeria',
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  amenities: {
    type: [String],
    default: []
  },
  images: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
listingSchema.index({ city: 1 });
listingSchema.index({ state: 1 });
listingSchema.index({ price: 1 });
listingSchema.index({ propertyType: 1 });
listingSchema.index({ bedrooms: 1 });
listingSchema.index({ status: 1 });
listingSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('listing', listingSchema);
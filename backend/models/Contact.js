const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  firstName: String,
  lastName: String,
  phone: String,
  customFields: {
    type: Map,
    of: String
  },
  segments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Segment'
  }],
  status: {
    type: String,
    enum: ['active', 'unsubscribed', 'bounced'],
    default: 'active'
  },
  engagement: {
    totalOpens: { type: Number, default: 0 },
    totalClicks: { type: Number, default: 0 },
    lastOpen: Date,
    lastClick: Date
  },
  location: {
    country: String,
    city: String,
    timezone: String
  },
  devices: [{
    type: String,
    device: String,
    browser: String,
    os: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

contactSchema.index({ 'customFields': 'text' });

module.exports = mongoose.model('Contact', contactSchema);
const mongoose = require('mongoose');

const trackingSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: true
  },
  type: {
    type: String,
    enum: ['sent', 'open', 'click', 'conversion', 'bounce'], // ✅ FIXED
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    device: String,
    browser: String,
    os: String,
    ip: String,
    location: String,
    url: String
  }
});

// prevent duplicate logs
trackingSchema.index({ campaignId: 1, contactId: 1, type: 1 });

module.exports = mongoose.model('Tracking', trackingSchema);
const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['email', 'sms', 'push', 'social'],
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'active', 'completed', 'paused'],
    default: 'draft'
  },
  targetAudience: {
    segments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Segment'
    }],
    filters: {
      type: Map,
      of: String
    }
  },
  content: {
    subject: String,
    body: String,
    html: String,
    template: String
  },
  schedule: {
    startDate: Date,
    endDate: Date,
    frequency: {
      type: String,
      enum: ['once', 'daily', 'weekly', 'monthly']
    },
    time: String
  },
  budget: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    spent: {
      type: Number,
      default: 0
    }
  },
  metrics: {
    sent: { type: Number, default: 0 },
    delivered: { type: Number, default: 0 },
    opened: { type: Number, default: 0 },
    clicked: { type: Number, default: 0 },
    converted: { type: Number, default: 0 },
    bounced: { type: Number, default: 0 }
  },
  abTest: {
    enabled: { type: Boolean, default: false },
    variantA: {},
    variantB: {},
    winner: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Campaign', campaignSchema);
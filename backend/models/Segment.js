const mongoose = require('mongoose');

const segmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  filters: [{
    field: String,
    operator: {
      type: String,
      enum: ['equals', 'contains', 'greater', 'less', 'between']
    },
    value: mongoose.Schema.Types.Mixed
  }],
  isDynamic: {
    type: Boolean,
    default: false
  },
  size: {
    type: Number,
    default: 0
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

module.exports = mongoose.model('Segment', segmentSchema);
const Segment = require('../models/Segment');
const Contact = require('../models/Contact');

// Create segment
exports.createSegment = async (req, res) => {
  try {
    const segment = await Segment.create({
      ...req.body,
      createdBy: req.user.id
    });
    
    // Calculate initial size
    const size = await calculateSegmentSize(segment._id);
    segment.size = size;
    await segment.save();
    
    res.status(201).json({ success: true, segment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all segments
exports.getSegments = async (req, res) => {
  try {
    const segments = await Segment.find({ createdBy: req.user.id });
    res.json({ success: true, segments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update segment
exports.updateSegment = async (req, res) => {
  try {
    const segment = await Segment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }
    
    // Recalculate size
    const size = await calculateSegmentSize(segment._id);
    segment.size = size;
    await segment.save();
    
    res.json({ success: true, segment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete segment
exports.deleteSegment = async (req, res) => {
  try {
    await Segment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Segment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get segment size preview
exports.previewSize = async (req, res) => {
  try {
    const size = await calculateSegmentSize(req.params.id);
    res.json({ success: true, size });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to calculate segment size
async function calculateSegmentSize(segmentId) {
  const segment = await Segment.findById(segmentId);
  if (!segment) return 0;
  
  // Build query based on filters
  const query = {};
  for (const filter of segment.filters) {
    switch (filter.field) {
      case 'email':
        query.email = { $regex: filter.value, $options: 'i' };
        break;
      case 'firstName':
        query.firstName = { $regex: filter.value, $options: 'i' };
        break;
      case 'lastName':
        query.lastName = { $regex: filter.value, $options: 'i' };
        break;
      case 'status':
        query.status = filter.value;
        break;
    }
  }
  
  return await Contact.countDocuments(query);
}
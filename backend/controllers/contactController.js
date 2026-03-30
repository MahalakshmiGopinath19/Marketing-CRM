const Contact = require('../models/Contact');
const Segment = require('../models/Segment');

// Create contact
exports.createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all contacts
exports.getContacts = async (req, res) => {
  try {
    const { page = 1, limit = 50, search } = req.query;
    const query = {};
    
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }
    
    const contacts = await Contact.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Contact.countDocuments(query);
    
    res.json({
      success: true,
      contacts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update contact
exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unsubscribe contact
exports.unsubscribe = async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { email: req.params.email },
      { status: 'unsubscribed' },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Import contacts
exports.importContacts = async (req, res) => {
  try {
    const { contacts } = req.body;
    const results = [];
    
    for (const contact of contacts) {
      try {
        const existing = await Contact.findOne({ email: contact.email });
        if (!existing) {
          const newContact = await Contact.create(contact);
          results.push({ email: contact.email, status: 'imported', id: newContact._id });
        } else {
          results.push({ email: contact.email, status: 'already exists' });
        }
      } catch (error) {
        results.push({ email: contact.email, status: 'failed', error: error.message });
      }
    }
    
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
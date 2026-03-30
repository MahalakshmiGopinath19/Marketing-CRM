const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// GET SETTINGS
router.get('/', protect, async (req, res) => {
  const user = await User.findById(req.user.id);

  res.json({
    success: true,
    settings: user.settings || {}
  });
});

// UPDATE SETTINGS
router.put('/', protect, async (req, res) => {
  const updates = req.body;

  const user = await User.findById(req.user.id);

  user.settings = {
    ...user.settings,
    ...updates
  };

  await user.save();

  res.json({
    success: true,
    settings: user.settings
  });
});

module.exports = router;
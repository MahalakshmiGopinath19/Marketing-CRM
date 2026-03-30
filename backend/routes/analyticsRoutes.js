const express = require('express');
const router = express.Router();
const Tracking = require('../models/Tracking');
const Campaign = require('../models/Campaign');
const Contact = require('../models/Contact');
const { protect } = require('../middleware/auth');

//  PUBLIC TRACKING ROUTE (NO AUTH)
router.get('/track/:type', async (req, res) => {
  try {
    const { campaign, contact, url } = req.query;
    const { type } = req.params;

    if (!campaign || !contact || !type) {
      return res.status(400).json({ message: "Missing tracking params" });
    }

    await Tracking.create({
      campaignId: campaign,
      contactId: contact,
      type,
      metadata: {
        url,
        userAgent: req.headers['user-agent'],
        ip: req.ip
      }
    });

    // CLICK REDIRECT
    if (type === 'click' && url) {
      return res.redirect(url);
    }

    // OPEN PIXEL RESPONSE
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );

    res.set({
      'Content-Type': 'image/gif',
      'Content-Length': pixel.length,
      'Cache-Control': 'no-store, no-cache, must-revalidate, private'
    });

    return res.end(pixel);

  } catch (error) {
    console.error("TRACK ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// PROTECTED ROUTES
router.use(protect);

// Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const totalCampaigns = await Campaign.countDocuments({ createdBy: req.user.id });

    const activeCampaigns = await Campaign.countDocuments({
      createdBy: req.user.id,
      status: 'active'
    });

    const totalContacts = await Contact.countDocuments();

    const totalOpens = await Tracking.countDocuments({ type: 'open' });
    const totalClicks = await Tracking.countDocuments({ type: 'click' });

    res.json({
      success: true,
      stats: {
        totalCampaigns,
        activeCampaigns,
        totalContacts,
        totalOpens,
        totalClicks
      }
    });

  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});


//Campaign analytics
router.get('/campaign/:id', async (req, res) => {
  try {
    const campaignId = req.params.id;

    const opens = await Tracking.countDocuments({
  campaignId: campaignId.toString(),
  type: 'open'
});

const clicks = await Tracking.countDocuments({
  campaignId: campaignId.toString(),
  type: 'click'
});
    const conversions = await Tracking.countDocuments({ campaignId, type: 'conversion' });

    res.json({
      success: true,
      analytics: { opens, clicks, conversions }
    });

  } catch (error) {
    console.error("CAMPAIGN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
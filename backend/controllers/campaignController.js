const Campaign = require('../models/Campaign');
const Contact = require('../models/Contact');
const Tracking = require('../models/Tracking');
const sendEmail = require('../utils/emailService');


// Create campaign
exports.createCampaign = async (req, res) => {
  try {
    const campaignData = {
      ...req.body,
      createdBy: req.user.id
    };

    const campaign = await Campaign.create(campaignData);
    res.status(201).json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all campaigns
exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .populate('targetAudience.segments', 'name');

    res.json({ success: true, campaigns });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get single campaign
exports.getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('targetAudience.segments', 'name');

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update campaign
exports.updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete campaign
exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.json({ success: true, message: 'Campaign deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// SEND CAMPAIGN (FINAL TEXT VERSION)
exports.sendCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Get active contacts
    const contacts = await Contact.find({ status: 'active' });

    if (!contacts.length) {
      return res.json({ success: false, message: 'No contacts found' });
    }

    if (campaign.type === 'email') {
      for (const contact of contacts) {

        // Subject
        const subject = String(
          campaign.subject || "No Subject"
        );

        // Message content
        const message = String(
          campaign.content?.text ||
          campaign.content?.html ||
          campaign.content ||
          "Hello! This is a campaign message."
        );

        // Send email (TEXT ONLY)
        await sendEmail({
          to: contact.email,
          subject,
          text: message,
          campaignId: campaign._id,
          contactId: contact._id
        });
      }
    }

    // Update campaign stats
    campaign.status = 'active';
    campaign.metrics.sent = contacts.length;
    await campaign.save();

    res.json({
      success: true,
      message: `Emails sent to ${contacts.length} contacts`
    });

  } catch (error) {
    console.error("SEND ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};



// Get campaign analytics
exports.getAnalytics = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    const tracking = await Tracking.aggregate([
      { $match: { campaignId: campaign._id } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const analytics = {
      campaign,
      opens: tracking.find(t => t._id === 'open')?.count || 0,
      clicks: tracking.find(t => t._id === 'click')?.count || 0,
      conversions: tracking.find(t => t._id === 'conversion')?.count || 0,
      bounces: tracking.find(t => t._id === 'bounce')?.count || 0
    };

    res.json({ success: true, analytics });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
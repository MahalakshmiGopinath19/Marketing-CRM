const express = require('express');
const router = express.Router();
const {
  createCampaign,
  getCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
  sendCampaign,
  getAnalytics
} = require('../controllers/campaignController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .post(createCampaign)
  .get(getCampaigns);

router.route('/:id')
  .get(getCampaign)
  .put(updateCampaign)
  .delete(deleteCampaign);

router.post('/:id/send', sendCampaign);
router.get('/:id/analytics', getAnalytics);

module.exports = router;
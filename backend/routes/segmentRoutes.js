const express = require('express');
const router = express.Router();
const {
  createSegment,
  getSegments,
  updateSegment,
  deleteSegment,
  previewSize
} = require('../controllers/segmentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .post(createSegment)
  .get(getSegments);

router.route('/:id')
  .put(updateSegment)
  .delete(deleteSegment);

router.get('/:id/preview', previewSize);

module.exports = router;
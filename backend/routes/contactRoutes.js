const express = require('express');
const router = express.Router();
const {
  createContact,
  getContacts,
  updateContact,
  unsubscribe,
  importContacts
} = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .post(createContact)
  .get(getContacts);

router.post('/import', importContacts);
router.put('/:id', updateContact);
router.post('/unsubscribe/:email', unsubscribe);

module.exports = router;
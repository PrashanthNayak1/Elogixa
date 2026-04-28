const express = require('express');
const router = express.Router();
const { submitContactMessage, getAllMessages, dialogflowWebhook } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

// @desc    Dialogflow webhook
// @route   POST /api/contact/webhook
router.post('/webhook', dialogflowWebhook);

// @desc    Submit a contact message
// @route   POST /api/contact
router.post('/', submitContactMessage);

// @desc    Get all contact messages
// @route   GET /api/contact
router.get('/', protect, getAllMessages);

module.exports = router;

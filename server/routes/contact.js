const express = require('express');
const router = express.Router();
const { submitContactMessage, getAllMessages } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

// @desc    Submit a contact message
// @route   POST /api/contact
router.post('/', submitContactMessage);

// @desc    Get all contact messages
// @route   GET /api/contact
router.get('/', protect, getAllMessages);

module.exports = router;

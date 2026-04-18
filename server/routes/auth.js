const express = require('express');
const router = express.Router();
const { login, register, googleAuth, getPendingAdmins, approveAdmin, rejectAdmin } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Auth user & get token
// @route   POST /api/auth/login
router.post('/login', login);

// @desc    Register a new admin
// @route   POST /api/auth/register
router.post('/register', register);

// @desc    Google Authentication
// @route   POST /api/auth/google
router.post('/google', googleAuth);

// @desc    Get pending admin requests
// @route   GET /api/auth/pending-admins
router.get('/pending-admins', protect, admin, getPendingAdmins);

// @desc    Approve pending admin request
// @route   PUT /api/auth/pending-admins/:id/approve
router.put('/pending-admins/:id/approve', protect, admin, approveAdmin);

// @desc    Reject pending admin request
// @route   DELETE /api/auth/pending-admins/:id/reject
router.delete('/pending-admins/:id/reject', protect, admin, rejectAdmin);

module.exports = router;

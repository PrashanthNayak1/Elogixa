const express = require('express');
const router = express.Router();
const {
    getAllJobs,
    createJob,
    deleteJob,
    getJobById
} = require('../controllers/jobController');

const { protect } = require('../middleware/authMiddleware');

// GET all jobs (Public)
router.get('/', getAllJobs);

// POST a new job (Admin)
router.post('/', protect, createJob);

// DELETE a job (Admin)
router.delete('/:id', protect, deleteJob);

// GET a single job
router.get('/:id', getJobById);

module.exports = router;

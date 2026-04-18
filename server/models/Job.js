const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    skills: {
        type: [String],
        required: true,
    },
    openings: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        default: 'Remote',
    },
    salaryRange: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Job', jobSchema);

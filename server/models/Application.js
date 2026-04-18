const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    phoneNormalized: {
        type: String,
        required: true,
        trim: true,
    },
    experienceYears: {
        type: Number,
        required: true,
        min: 0,
    },
    resumePath: {
        type: String,
        required: true,
    },
    resumeOriginalName: {
        type: String,
        default: '',
    },
    atsScore: {
        type: Number,
        default: null,
    },
    missingSkills: {
        type: [String],
        default: [],
    },
    status: {
        type: String,
        enum: ['Pending', 'Under Review', 'Shortlisted', 'Rejected', 'Accepted'],
        default: 'Pending',
    },
    isSavedForFuture: {
        type: Boolean,
        default: false,
    },
    savedForFutureAt: {
        type: Date,
        default: null,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
});

applicationSchema.index({ jobId: 1, email: 1 }, { unique: true });
applicationSchema.index({ jobId: 1, phoneNormalized: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);

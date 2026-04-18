const Application = require('../models/Application');
const Job = require('../models/Job');
const { sendStatusUpdateEmail } = require('../services/emailService');
const cloudinary = require('../config/cloudinaryConfig');
const { evaluateResume } = require('../services/atsService');
const pdfParse = require('pdf-parse');


const submitApplication = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Resume file is required' });
    }

    try {
        const trimmedPhone = (req.body.phone || '').trim();
        const normalizedEmail = (req.body.email || '').trim().toLowerCase();
        const normalizedPhone = trimmedPhone.replace(/\D/g, '');
        const experienceYears = Number(req.body.experienceYears);

        if (!normalizedEmail || !normalizedPhone) {
            return res.status(400).json({ message: 'Email and Phone number are required' });
        }

        const existingApplication = await Application.findOne({
            jobId: req.body.jobId,
            $or: [
                { email: normalizedEmail },
                { phone: trimmedPhone },
                { phoneNormalized: normalizedPhone },
            ]
        }).lean();

        if (existingApplication) {
            const duplicateFields = [];
            if (existingApplication.email === normalizedEmail) duplicateFields.push('email');
            if (existingApplication.phone === trimmedPhone || existingApplication.phoneNormalized === normalizedPhone) duplicateFields.push('phone number');

            return res.status(409).json({
                message: `You have already applied for this job with this ${duplicateFields.join(' and ')}.`
            });
        }
        // stream to Cloudinary
        const streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'resumes',
                        resource_type: 'auto',
                        type: 'upload',
                        access_mode: 'public', // Ensure public access
                    },
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                stream.end(req.file.buffer);
            });
        };

        const result = await streamUpload(req);

        let atsScore = null;
        let missingSkills = [];
        let presentSkills = [];

        try {
            // parse PDF to text
            const pdfData = await pdfParse(req.file.buffer);
            const resumeText = pdfData.text;

            // evaluate ATS score
            const job = await Job.findById(req.body.jobId);
            if (job) {
                const evaluation = await evaluateResume(resumeText, job.description, job.skills);
                atsScore = evaluation.atsScore;
                missingSkills = evaluation.missingSkills;
                presentSkills = evaluation.presentSkills;
            }
        } catch (err) {
            console.error('Error during ATS evaluation:', err);
        }

        const application = new Application({
            jobId: req.body.jobId,
            name: req.body.name,
            email: normalizedEmail,
            phone: trimmedPhone,
            phoneNormalized: normalizedPhone,
            experienceYears: isNaN(experienceYears) ? 0 : experienceYears,
            resumePath: result.secure_url, // Storing Cloudinary URL
            atsScore,
            missingSkills,
            presentSkills
        });

        const newApplication = await application.save();
        res.status(201).json(newApplication);
    } catch (err) {
        console.error('Cloudinary upload error:', err);
        res.status(400).json({ message: 'Error uploading resume: ' + err.message });
    }
};

const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find().sort({ submittedAt: -1 }).populate('jobId', 'title skills');
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateApplicationStatus = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate('jobId', 'title');
        if (!application) return res.status(404).json({ message: 'Application not found' });

        const oldStatus = application.status;
        const newStatus = req.body.status;

        if (newStatus && oldStatus !== newStatus) {
            application.status = newStatus;
            const updatedApplication = await application.save();

            // Send email notification
            const jobTitle = application.jobId ? application.jobId.title : 'Position';
            const emailResult = await sendStatusUpdateEmail(
                application.email,
                application.name,
                jobTitle,
                newStatus
            );

            if (!emailResult.success) {
                console.error('Failed to send email:', emailResult.error);
            }

            res.json({
                ...updatedApplication.toObject(),
                emailSent: emailResult.success
            });
        } else {
            res.json(application);
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteApplication = async (req, res) => {
    try {
        const application = await Application.findByIdAndDelete(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.json({ message: 'Application deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const toggleSavedResume = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate('jobId', 'title');
        if (!application) return res.status(404).json({ message: 'Application not found' });

        const shouldSave = Boolean(req.body.isSavedForFuture);
        application.isSavedForFuture = shouldSave;
        application.savedForFutureAt = shouldSave ? new Date() : null;

        const updatedApplication = await application.save();
        res.json(updatedApplication);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    submitApplication,
    getAllApplications,
    updateApplicationStatus,
    toggleSavedResume,
    deleteApplication
};

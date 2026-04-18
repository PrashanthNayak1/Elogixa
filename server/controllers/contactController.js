const Contact = require('../models/Contact');
const { sendContactNotificationEmail } = require('../services/emailService');

const submitContactMessage = async (req, res) => {
    try {
        const { name, email, country, service, message } = req.body;

        const contact = await Contact.create({
            name,
            email,
            country,
            service,
            message,
        });

        const emailResult = await sendContactNotificationEmail({
            name,
            email,
            country,
            service,
            message,
        });

        res.status(201).json({
            ...contact.toObject(),
            emailSent: emailResult.success,
            emailError: emailResult.success ? null : emailResult.error,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getAllMessages = async (req, res) => {
    try {
        const messages = await Contact.find({}).sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    submitContactMessage,
    getAllMessages
};

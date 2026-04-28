const Contact = require('../models/Contact');
const { sendContactNotificationEmail } = require('../services/emailService');

const dialogflowWebhook = async (req, res) => {
    try {
        console.log("Webhook Body:", JSON.stringify(req.body, null, 2));

        const params = req.body.queryResult?.parameters || {};

        const name = typeof params['person'] === 'object' ? params['person']?.name : params['person'] || params.name || '';
        const email = params.email || '';
        const country = params['geo-country'] || '';
        const service = params.service || '';
        const message = params.message || '';

        if (!name || !email || !service || !message) {
            // During slot filling, return empty response so Dialogflow keeps collecting
            return res.json({});
        }

        await Contact.create({ name, email, country, service, message });

        await sendContactNotificationEmail({ name, email, country, service, message });

        return res.json({
            fulfillmentText: `Thanks ${name}! We received your request and will contact you soon.`
        });
    } catch (error) {
        console.error("Webhook error:", error);
        return res.json({
            fulfillmentText: "Something went wrong. Please try again later."
        });
    }
};

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
    dialogflowWebhook,
    submitContactMessage,
    getAllMessages
};

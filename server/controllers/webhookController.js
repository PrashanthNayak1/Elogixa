const { dialogflowWebhook } = require('./contactController');
const { askGroq } = require('../services/groqService');
const Job = require('../models/Job');

const JOB_KEYWORDS = ['job', 'jobs', 'career', 'careers', 'opening', 'openings', 'vacancy', 'vacancies', 'hiring', 'position', 'positions', 'work', 'apply', 'available jobs'];

const isJobQuery = (text) => {
    const lower = text.toLowerCase();
    return JOB_KEYWORDS.some(keyword => lower.includes(keyword));
};

const handleWebhook = async (req, res) => {
    const queryResult = req.body?.queryResult;

    if (!queryResult?.queryText) {
        return res.status(400).json({
            fulfillmentText: "Invalid request"
        });
    }

    const intentName = queryResult?.intent?.displayName || "";
    const userText = queryResult.queryText;

    // Contact intent → save to MongoDB
    if (intentName.toLowerCase().includes("contact")) {
        return dialogflowWebhook(req, res);
    }

    // Job query → fetch from MongoDB
    if (isJobQuery(userText)) {
        try {
            const jobs = await Job.find({}).sort({ createdAt: -1 });

            if (!jobs || jobs.length === 0) {
                return res.json({
                    fulfillmentText: "We don't have any open positions at the moment. Please check back later or contact us for more information."
                });
            }

            const jobList = jobs.map((job, i) =>
                `\n📌 *${job.title}*\n   • ${job.openings} position${job.openings > 1 ? 's' : ''} available\n   • Location: ${job.location}`
            ).join('\n');

            return res.json({
                fulfillmentText: `🎯 *Current Job Openings at Elogixa:*${jobList}\n\n💼 Ready to apply? Visit our Jobs page or type "contact" to speak with our HR team!`
            });
        } catch (err) {
            console.error("Job fetch error:", err);
            return res.json({
                fulfillmentText: "Sorry, I couldn't fetch job listings right now. Please visit our Jobs page."
            });
        }
    }

    // All other queries → Groq AI
    const reply = await askGroq(userText);
    res.json({ fulfillmentText: reply });
};

module.exports = { handleWebhook };

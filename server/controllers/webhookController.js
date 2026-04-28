const { dialogflowWebhook } = require('./contactController');
const { askGroq } = require('../services/groqService');

const handleWebhook = async (req, res) => {
    const queryResult = req.body?.queryResult;

    if (!queryResult?.queryText) {
        return res.status(400).json({
            fulfillmentText: "Invalid request"
        });
    }

    const intentName = queryResult?.intent?.displayName || "";

    if (intentName.toLowerCase().includes("contact")) {
        return dialogflowWebhook(req, res);
    }

    const reply = await askGroq(queryResult.queryText);

    res.json({
        fulfillmentText: reply
    });
};

module.exports = { handleWebhook };
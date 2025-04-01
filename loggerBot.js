require('dotenv').config();
const axios = require('axios');

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

// Function to log messages to Discord using Webhook
async function logToDiscord(message) {
    if (!WEBHOOK_URL) {
        console.error("❌ Webhook URL is not set!");
        return;
    }

    try {
        await axios.post(WEBHOOK_URL, {
            content: `📜 Log: ${message}`
        });
    } catch (error) {
        console.error("❌ Failed to send log to Discord:", error);
    }
}

module.exports = logToDiscord;

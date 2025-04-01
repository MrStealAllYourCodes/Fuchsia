require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

async function logToDiscord(message) {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    if (channel) {
        channel.send(message);
    }
}

client.login(process.env.DISCORD_TOKEN);

// Example: Logging a message from your server
process.on('uncaughtException', (err) => {
    logToDiscord(`Server Error: ${err.message}`);
});

module.exports = logToDiscord;

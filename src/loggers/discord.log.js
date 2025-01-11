const { Client, GatewayIntentBits } = require("discord.js");

try {
  const client = new Client({
    intents: [
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  const token = process.env.DISCORD_BOT_TOKEN;
  client.login(token);

  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.content === "hello") {
      message.reply("Hello! How can I help you?");
    }
  });
} catch (error) {
  console.error("Please check your token again");
}

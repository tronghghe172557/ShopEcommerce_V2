const { Client, GatewayIntentBits } = require("discord.js");

const { DISCORD_CHANNEL_ID, DISCORD_BOT_TOKEN } = process.env;
class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    // add channel id
    this.channelId = DISCORD_CHANNEL_ID;
    this.client.on("ready", () => {
      console.log(`Logged in as ${this.client.user.tag}!`);
    });

    this.client.login(DISCORD_BOT_TOKEN);
  }

  sendToFormatCode(logData) {
    const {
      code,
      message = `This is some additional information about the code`,
      title = "Code Example",
    } = logData;

    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt("00ff00", 16), // Convert hexadecimal color code to integer
          title,
          description: '```json\n' + JSON.stringify(code, null, 2) + '\n```' , // Example JSON object
        },
      ],
    };

    this.sendToMessage(codeMessage);
  }

  sendToMessage(message = "message") {
    const channel = this.client.channels.cache.get(this.channelId); // get channel => bot
    if (!channel) {
      console.error("Channel not found ", this.channelId);
      return;
    }

    // message use CHAT GPT API CALL => update latter
    channel.send(message).catch((e) => console.error("Error: ", e));
  }
}

const loggerService = new LoggerService();
module.exports = loggerService;

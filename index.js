const telegramBot = require("node-telegram-bot-api");
const token = env.BOT_TOKEN;
const bot = new telegramBot(token, { polling: true });
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Hello world, this is my first message");
});

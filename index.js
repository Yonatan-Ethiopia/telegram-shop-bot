const telegramBot = require("node-telegram-bot-api");
require('dotenv').config();

const token = process.env.BOT_TOKEN;
const bot = new telegramBot(token, { polling: true });
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Hello world, this is my first message");
});
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage( chatId, "I will help you sir")
});
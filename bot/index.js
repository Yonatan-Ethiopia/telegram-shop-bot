const telegramBot = require("node-telegram-bot-api");

const mongoose = require("mongoose");
const product = require("../models/productModel");

const { add, list, update, delete} = require('../handlers/handlers');

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

bot.onText( /\/add/, add );

bot.onText( /\/list/, list);

bot.onText( /\/update/, update);

bot.onText( /\/delete/, delete);
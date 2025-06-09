const telegramBot = require("node-telegram-bot-api");

const mongoose = require("mongoose");
mongoose.connect( process.env.MONGODB_URL,{ useNewUrlParser: true,
useUnifiedTopology: true }).then(()=> console.log("Connected to MongoDb")).catch((err)=>console.log(err));
const product = require("../models/productsModel");
const data = product.find();
const { start, help, list, available} = require('../bot/handlers/handlers');

require('dotenv').config();

const token = process.env.BOT_TOKEN;
const bot = new telegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => start(bot, msg));

bot.onText(/\/help/, (msg) => help(bot, msg));

bot.onText( /\/list/, (msg) => (bot, msg, data) );

bot.onText( /\/available/, (msg) => available(bot, msg, data));

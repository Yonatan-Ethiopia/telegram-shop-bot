const telegramBot = require("node-telegram-bot-api");

const mongoose = require("mongoose");
mongoose.connect( process.env.MONGODB_URL,{ useNewUrlParser: true,
useUnifiedTopology: true }).then(()=> console.log("Connected to MongoDb")).catch((err)=>console.log(err));
const product = require("../models/productsModel");
const { start, help, list, available, initiate_Add, add} = require('../bot/handlers/handlers');

require('dotenv').config();

const token = process.env.BOT_TOKEN;
const bot = new telegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => start(bot, msg));

bot.onText(/\/help/, (msg) => help(bot, msg));

bot.onText(/\/list/, (msg) => list(bot, msg));

bot.onText( /\/available/, (msg) => available(bot, msg));
bot.onText( /\/add/, (msg)=>
  initiate_Add(bot, msg)
);
bot.on('message', (msg)=>
  add(bot, msg)
);
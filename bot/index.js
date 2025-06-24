const telegramBot = require("node-telegram-bot-api");

const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDb"))
  .catch((err) => console.log(err));
const products = require("../models/productsModel");
const  {authRole} = require("../bot/handlers/authHandler");

const { Owner_start, Owner_keyButtons } = require('../bot/handlers/ownerHandler');
const { User_start, User_keyButtons, User_inline} = require('../bot/handlers/userHandler');
const { Admin_start, Admin_keyButtons, Admin_inline} = require('../bot/handlers/adminHandler');

require("dotenv").config();

const token = process.env.BOT_TOKEN;
const bot = new telegramBot(token, { polling: true });
let role = "";
try{
bot.onText(/\/start/, async (msg) => { try{
  role = await authRole(msg);
  if(role === "owner"){
    Owner_start(bot, msg);
  }else if(role === "admin"){
     Admin_start(bot, msg); }
  else if( role === "user"){
    User_start(bot, msg)
  }}catch(err){
      bot.sendMessage(msg.chat.id, `${err}`)
  }
})
/*bot.onText(/\/help/, async (msg) => {
  role = await auth(msg);
  if(role === "owner"){
    
  }else if( role === "admin"){
    Admin_help(bot, msg);
  }else if( role === "user"){
    
  }
}
bot.onText(/\/list/, async (msg) => {
  role = await auth(msg);
  if( role === "owner"){
    
  }else if( role === "admin"){
    Admin_list(bot, msg);
  }else if( role === "user"){
    
  }
})
bot.onText(/\/available/, (msg) => Admin_available(bot, msg));
bot.onText(/\/add/, (msg) => Admin_initiate_Add(bot, msg));*/
bot.on("message", async (msg) => {
  try{
  role = await authRole(msg);
  if( role === "owner"){
    await Owner_keyButtons(bot, msg);
    role = ""
  }else if( role === "admin"){
    Admin_keyButtons(bot, msg);
  }else if( role === "user"){
    User_keyButtons(bot, msg);
  }}catch(err){
    bot.sendMessage(msg.chat.id, `${err}`)  }
})
bot.on("callback_query", async (query) => {
  try{
  bot.answerCallbackQuery(query.id);
  role = await authRole(msg);
  if(role === "owner"){
   /* Owner_inline(bot, query);*/
  }else if(role === "admin"){
     Admin_inline(bot, query); }
  else if( role === "user"){
    User_inline(bot, query);
  }}catch(err){
    bot.sendMessage(msg.chat.id, `${err}`)
  }
})
}
catch(err){
  console.log(err)
}
const products = require('../models/productModel')

const start = (bot, msg)=>{
  bot.sendMessage( msg.chat.id, "Hello! Use the following commands to interact with me.
                /list
                /available
                /help )
}
const help = (bot, msg)=>{
  bot.sendMessage( msg.chat.id, "How can I help you?")
}
const list = (bot, msg)=>{
  const data = products.find();
  bot.sendMessage( msg.chat.id, data)
}
const available = (bot, msg)=>{
  const data = products.find({ status: 'available' });
  bot.sendMessage( msg.chat.id, data)
}
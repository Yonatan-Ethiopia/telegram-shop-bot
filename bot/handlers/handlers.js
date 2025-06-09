
const start = (bot, msg)=>{
  bot.sendMessage( msg.chat.id, "Hello! Use the following commands to interact with me.\n /start - Start the bot\n /help - Get help\n /list - List all products\n /available - List available products")}
const help = (bot, msg)=>{
  bot.sendMessage( msg.chat.id, "How can I help you?")
}
const list = (bot, msg, data)=>{
  bot.sendMessage( msg.chat.id, data)
}
const available = (bot, msg, data)=>{
  const Ndata = data.find({ status: 'available' });
  bot.sendMessage( msg.chat.id, Ndata)
}; 
const add = (bot, msg)=>{
  
}
module.exports = { start, help, list, available}
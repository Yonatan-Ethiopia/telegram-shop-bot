const products = require('../../models/productsModel');
let isAdding = false;
let step = 'none';
let newProduct = {}
const start = (bot, msg)=>{
  const data = products.find();
  bot.sendMessage( msg.chat.id, "Hello! Use the following commands to interact with me.\n /start - Start the bot\n /help - Get help\n /list - List all products\n /available - List available products")}
const help = (bot, msg)=>{
  bot.sendMessage( msg.chat.id, "How can I help you?")
}
const list = (bot, msg)=>{
  const data = products.find();
  bot.sendMessage( msg.chat.id, data)
}
const available = (bot, msg, data)=>{
  const Ndata = data.find({ status: 'available' });
  bot.sendMessage( msg.chat.id, Ndata)
}; 
const initiate_Add = (bot, msg)=>{
  isAdding = true;
  newProduct[msg.chat.id] = {}
  step = 'name';
  bot.sendMessage( msg.chat.id, "What is the name of the product");
}
const add = async (bot, msg)=>{
  if( msg.text == '/add' || msg.text == '/start' || msg.text == 'help' || msg.text == '/list' || msg.text == '/available') return;
  if(isAdding){
    if(step == 'name'){
      const name = msg.text;
      newProduct.name = name;
      step = 'price';
      bot.sendMessage( msg.chat.id,"What is the price of the product ?") }
    else if(step == 'price'){
      newProduct.price = msg.text;
      step = 'category';
      bot.sendMessage( msg.chat.id,"What is the category of the product ?")
    }
    else if(step == 'category'){
      newProduct.category = msg.text;
      step = 'none';
      isAdding = false;
      await products.create(newProduct);
      bot.sendMessage(msg.chat.id, "Product added successfully \n Name : " + newProduct.name + "\n Price : " + newProduct.price + "\n Category : " + newProduct.category + "\n Status: available");
      newProduct = {}; }
    }
  
}
module.exports = { start, help, list, available, initiate_Add, add}
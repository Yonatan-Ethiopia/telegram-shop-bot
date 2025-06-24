const products = require("../../models/productsModel");
let categories = [];
const start = (bot, msg) => {
  bot.sendMessage(msg.chat.id, "Welcome to our store! You can view and order products here.", {reply_markup:{ keyboard:[["📦View all products", "🗂 View products by category"]]}});
}
const Kbuttons = async (bot, msg)=>{
  if(msg.text == "📦View all products"){
    list(bot, msg);
    return;
  }
  if(msg.text == "🗂 View products by category"){
    categories = await products.distinct("category");
    bot.sendMessage(msg.chat.id, "Please choose from the below categories to explore.",{ reply_markup: {inline_keyboard: categories.map((category)=>{ return [{text: category, callback_data:` list:${category}`}]})}});
  }
  
}
const Ibuttons = async (bot, query)=>{
  const chatId = query.message.chat.id;
  const data = query.data;
  const [action, value] = data.split(":");
  if(action == "list"){
    const productsByCategory = await products.find({category: value});
    bot.sendMessage(chatId, `Here are the products in ${value} category`);
    productsByCategory.forEach(product=>{
      bot.sendPhoto(chatId, product.image, {caption: `Name: ${product.name}\nPrice: ${product.price}\nStatus: ${product.status}`, reply_markup: {inline_keyboard: [[{text: "🛍Order", callback_data:`Order:${product._id}`}]]}})
    })
  }
  if(action === "Order"){
    const orderedProduct = await products.findById(value);
    bot.sendPhoto(adminId, orderedProduct.image, {caption: `Order for ${orderedProduct.name} category ${orderedProduct.category} for ${orderedProduct.price} has been placed by ${msg.chat.usernae}`});
    bot.sendMessage(chatId, `Your order for ${orderedProduct.name} has been placed.`);
  }
}
module.exports = {start, Kbuttons, Ibuttons};
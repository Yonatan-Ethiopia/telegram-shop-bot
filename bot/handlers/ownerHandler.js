const admins = require("../../models/adminsModel");
const pages = require("../../models/pagesModel");
const owners = require("../../models/ownerModel");
const adding = true;
const addStep = "none";
const start = (bot, msg)=>{
  bot.sendMessage(msg.chat.id, "Welcome owner!👋 \n What would you like to do ?🧨",{ reply_markup: { keyboard: [["➕️Add new admin", "View current admins"],["Add owner"]], one_time_keyboard: false, resize_keyboard: true}})
}
const keyButtons = async (bot, msg) => {
  try{
    if( msg.text == "Add owner"){
      const ownerId = msg.from.id;
      const ownerName = msg.from.first_name;
      const ownerUN = msg.from.username;
      const newOwner = await owners.create({ id:  ownerId,  Name: ownerName, Username: ownerUN});
      bot.sendMessage(msg.chat.id, `New owner ${newOwner.name} ${newOwner.Username} is added.`)
    }
    if( msg.text == "🏠Back to main menu"){
      bot.sendMessage(msg.chat.id, "Main menu🏠",{ reply_markup: { keyboard:[["➕️Add new admin", "View current admins"]], one_time_keyboard: false, resize_keyboard: true}}); 
    }
  if( msg.text == "Add new admin"){
    bot.sendMessage(msg.chat.id, "Please forward the new channel.💻", {reply_markup: {keyboard: [["🏠Back to main menu"]], one_time_keyboard: true, resize_keyboard: true}});
    adding = true;
    addStep = "channel";
  }
  if( adding && addStep == "channel" && msg.forward_from_chat){
    const newPage = await pages.create({name: msg.forward_from_chat.title, username: msg.forward_from_chat.username, id: msg.forward_from_chat.id});
    bot.sendMessage(msg.chat.id, "Please forward the new admin.💻", {reply_markup: {keyboard: [["🏠Back to main menu"]], one_time_keyboard: true, resize_keyboard: true}});
    addStep = "admin";
  }
  if( adding && addStep == "admin" && msg.forward_from){
    const newAdmin = await admins.create({name: msg.forward_from.first_name, username: msg.forward_from.username, id: msg.forward_from.id, page: newPage._id})
    adding = false;
    addStep = "none";
  }
  }catch(err){
    console.log(err);
    bot.sendMessage(msg.chat.id, `An error accured \n ${err}`);
  }
};
module.exports = {start, keyButtons}
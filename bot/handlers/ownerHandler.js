const admins = require("../../models/adminsModel");
const pages = require("../../models/pagesModel");
const owners = require("../../models/ownerModel");
let adding = true;
let addStep = "none";
let sharing = false;
let shareStep = "";
let newPage = {};
const Owner_start = (bot, msg)=>{
  bot.sendMessage(msg.chat.id, "Welcome owner!👋 \n What would you like to do ?🧨",{ reply_markup: { keyboard: [["➕️Add new admin", "View current admins"],["Add owner"]], one_time_keyboard: false, resize_keyboard: true}})
}
const Owner_keyButtons = async (bot, msg) => {
  try{
    if( msg.text == "View current admins"){
      const data = await admins.find().sort({ createdAt: -1 });
      if( data.length === 0 || data.length == undefined || data == null){
        bot.sendMessage(msg.chat.id, "No admins found.", {reply_markup: {keyboard: [["🏠Back to main menu"]], one_time_keyboard: true, resize_keyboard: true}})    
    }
      else{
        bot.sendMessage(msg.chat.id, "Here are the current admins.", {reply_markup: {keyboard: [["🏠Back to main menu"]], one_time_keyboard: true, resize_keyboard: true}});
        data.forEach((admin)=>{
          const page = admin.populate("page")
          
          bot.sendMessage(msg.chat.id, `Name: ${admin.name}\nUsername: @${admin.Username}\nChannel: ${page.username}`, {reply_markup: {inline_keyboard: [[{text: "⚡️Delete", callback_data: `delete:${admin._id}`}]]}});
        }) 
      }
    }
    if( msg.text == "Add owner"){
      sharing = true;
      shareStep = "forward"
      bot.sendMessage(msg.chat.id, "Please forward the new owner.", {reply_markup: {keyboard: [["🏠Back to main menu"]], one_time_keyboard: true, resize_keyboard: true}});
      return;
    }
    if( sharing && shareStep == "forward"){
      const ownerId = msg.from.id;
      const ownerName = msg.from.first_name;
      const ownerUN = msg.from.username;
      const newOwner = await owners.create({ id:  ownerId,  name: ownerName, username: ownerUN});
      bot.sendMessage(msg.chat.id, `New owner ${newOwner.name} ${newOwner.username} is added.`, {reply_markup: {keyboard: [["🏠Back to main menu"]], one_time_keyboard: true, resize_keyboard: true}} );

      sharing = false;
      shareStep = "none";
    }
    
    if( msg.text == "🏠Back to main menu"){
      bot.sendMessage(msg.chat.id, "Main menu🏠",{ reply_markup: { keyboard:[["➕️Add new admin", "View current admins"]], one_time_keyboard: false, resize_keyboard: true}}); 
    }
  if( msg.text == "➕️Add new admin"){
    bot.sendMessage(msg.chat.id, "Please forward the new channel.💻", {reply_markup: {keyboard: [["🏠Back to main menu"]], one_time_keyboard: true, resize_keyboard: true}});
    adding = true;
    addStep = "channel";
  }
  if( adding && addStep == "channel" && msg.forward_from_chat){
    newPage[msg.chat.id] = { name: msg.forward_from_chat.title, username: msg.forward_from_chat.username, id: msg.forward_from_chat.id};
    /*newPage = await pages.create({name: msg.forward_from_chat.title, username: msg.forward_from_chat.username, id: msg.forward_from_chat.id});*/
    bot.sendMessage(msg.chat.id, "Please forward the new admin.💻", {reply_markup: {keyboard: [["🏠Back to main menu"]], one_time_keyboard: true, resize_keyboard: true}});
    addStep = "admin";
  }
  if( adding && addStep == "admin" && msg.forward_from){
    const nPage = await pages.create(newPage[msg.chat.id])
    const newAdmin = await admins.create({name: msg.forward_from.first_name, Username: msg.forward_from.username, id: msg.forward_from.id, page: nPage._id})
    bot.sendMessage(msg.chat.id, `New admin ${newAdmin.name} @${newAdmin.Username} with channel ${nPage.name} @${nPage.username} is added.`, {reply_markup: {keyboard: [["🏠Back to main menu"]], one_time_keyboard: true, resize_keyboard: true}})
    adding = false;
    addStep = "none";
    delete newPage[msg.chat.id];
  }
  }catch(err){
    console.log(err);
    bot.sendMessage(msg.chat.id, `An error accured \n ${err}`);
  }
const Owner_inline = async (bot, query)=>{
  const data = query.data;
  const [action, value] = data.split(":");
  if( action == "delete"){
    const del = await admins.findByIdAndDelete(value);
  }
}
};
module.exports = {Owner_start, Owner_keyButtons}
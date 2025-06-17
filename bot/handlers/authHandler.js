const owners = require('../../models/ownerModel');
const admins = require('../../models/adminsModel');
const channels = require('../../models/channelsModel');
const isOwner = async (bot, msg, id)=>{
  const owner = await owners.findOne({id: id});
  if(!owner){
    bot.sendMessage(msg.chat.id, "Permission denied");
    return false;
  }else if(owner){
    return true;
  }
  
}
const isAdmin = async (bot, msg, id)=>{
  const admin = await admins.findOne({id: id});
  if(!admin){
    bot.sendMessage(msg.chat.id, "Permission denied");
    return false;
  }else if(admin){
    const page = await admins.findById(admin._id).populate('page');
    return true, page;
    
  }
}
module.exports = { isOwner, isAdmin };
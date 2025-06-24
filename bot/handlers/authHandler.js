const owners = require("../../models/ownerModel");
const admins = require("../../models/adminsModel");
let role = "";
const authId = async (msg) => {
  const isOwner = await owners.findOne({ id: msg.from.id });
  const isAdmin = await admins.findOne({ id: msg.from.id });
  if (!isOwner && !isAdmin) {
    role = "owner";
  } else if (isOwner) {
    role = "owner";
  } else if (isAdmin) {
    role = "admin";
  }
  return role;
};
module.exports = authId;
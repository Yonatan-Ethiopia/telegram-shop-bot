const products = require("../../models/productsModel");
let isAdding = false;
let step = "none";
let newProduct = {};
let deleting = false;
let mainMenu = false;
let deleteMenu = false;
let deleteSubMenu = false;
const start = (bot, msg) => {
  //bot.sendMessage(
  // msg.chat.id,
  //"Hello! Use the following commands to interact with me.\n /start - Start the bot\n /help - Get help\n /list - List all products\n /available - List available products",
  //);
  bot.sendMessage(
    msg.chat.id,
    "Hello there!👋 I will help you navigate through this bot.",
    {
      reply_markup: {
        keyboard: [
          ["📦View products", "➕️Add products"],
          ["📝Edit products", "✖️Delete products"],
        ],
        one_time_keyboard: false,
        resize_keyboard: true,
        remove_keyboard: mainMenu,
      },
    },
  );
};
const help = (bot, msg) => {
  bot.sendMessage(msg.chat.id, "How can I help you?");
};
const list = async (bot, msg) => {
  try {
    const data = await products.find().sort({ createdAt: -1 });
    if (data.length === 0) {
      bot.sendMessage(msg.chat.id, "No products found.");
    } else {
      for (let i = 0; i < data.length; i++) {
        bot.sendPhoto(msg.chat.id, data[i].image, {
          caption:
            "Name : " +
            data[i].name +
            "\n Price : " +
            data[i].price +
            "\n Stock : " +
            data[i].stock +
            "\n Category : " +
            data[i].category,
          reply_markup: {
            inline_keyboard: [
              [
                { text: "Edit", callback_data: `edit:${data[i]._id}` },
                { text: "Delete", callback_data: `delete:${data[i]._id}` },
              ],
            ],
          },
        });
      }
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    bot.sendMessage(msg.chat.id, "Error fetching products. Please try again.");
  }
};
const available = async (bot, msg) => {
  try {
    const data = await products.find({ status: "available" });
    if (data.length === 0) {
      bot.sendMessage(msg.chat.id, "No available products found.");
    } else {
      let message = "✅ Available Products:\n\n";
      data.forEach((product, index) => {
        message += `${index + 1}. Name: ${product.name}\n   Price: ${product.price}\n   Category: ${product.category}\n\n`;
      });
      bot.sendMessage(msg.chat.id, message);
    }
  } catch (error) {
    console.error("Error fetching available products:", error);
    bot.sendMessage(
      msg.chat.id,
      "Error fetching available products. Please try again.",
    );
  }
};
const initiate_Add = (bot, msg) => {
  isAdding = true;
  const chatId = msg.chat.id;
  newProduct[chatId] = {};
  step = "name";
  bot.sendMessage(chatId, "What is the name of the product");
};
const add = async (bot, msg) => {
  if (
    msg.text == "/add" ||
    msg.text == "/start" ||
    msg.text == "help" ||
    msg.text == "/list" ||
    msg.text == "/available"
  )
    return;
  if (msg.text == "📦View products") {
    list(bot, msg);
    return;
  }
  if (msg.text == "➕️Add products") {
    const chatId = msg.chat.id;
    try {
      if (!isAdding) {
        isAdding = true;
        const chatId = msg.chat.id;
        newProduct[chatId] = {};
        step = "name";
        bot.sendMessage(chatId, "What is the name of the product");
      }
      if (isAdding) {
        if (step == "name") {
          const name = msg.text;
          newProduct[chatId].name = name;
          step = "price";
          bot.sendMessage(msg.chat.id, "What is the price of the product ?");
        } else if (step == "price") {
          newProduct[chatId].price = msg.text;
          step = "category";
          bot.sendMessage(msg.chat.id, "What is the category of the product ?");
        } else if (step == "category") {
          newProduct[chatId].category = msg.text;
          step = "image";
          bot.sendMessage(msg.chat.id, "Upload a picture of the product");
        } else if (msg.photo) {
          const fileId = msg.photo[msg.photo.length - 1].file_id;
          newProduct[chatId].image = fileId;
          isAdding = false;
          step = "none";
          await products.create(newProduct[chatId]);
          bot.sendPhoto(msg.chat.id, fileId, {
            caption:
              "Product added successfully \n Name : " +
              newProduct[chatId].name +
              "\n Price : " +
              newProduct[chatId].price +
              "\n Category : " +
              newProduct[chatId].category +
              "\n Status: available",
          });
          delete newProduct[chatId];
        }
      }
    } catch (err) {
      bot.sendMessage(msg.chat.id, err);
      console.log(err);
    }
    return;
  }
  /*if ((msg.text = "📝Edit products")) {
    return;
  }
*/
  if (msg.text == "🏠Back to main menu") {
    isAdding = false;
    step = "none";
    newProduct = {};
    deleting = false;
    mainMenu = false;
    deleteMenu = false;
    deleteSubMenu = false;
    bot.sendMessage(msg.chat.id, "🏠 Main menu", {
      reply_markup: {
        keyboard: [
          ["📦View products", "➕️Add products"],
          ["📝Edit products", "✖️Delete products"],
        ],
        one_time_keyboard: false,
        resize_keyboard: true,
      },
    });
  }
  if (msg.text == "✖️Delete products") {
    deleting = true;
    mainMenu = true;
    bot.sendMessage(
      msg.chat.id,
      "Do you want to delete all or a specific product ?",
      {
        reply_markup: {
          keyboard: [["🔥All", "⚡️Specific"], ["🏠Back to main menu"]],
          one_time_keyboard: true,
          resize_keyboard: true,
          remove_keyboard: deleteMenu,
        },
      },
    );
    return;
  }
  if (deleting && msg.text == "All") {
    deleteMenu = true;
    bot.sendMessage(
      msg.chat.id,
      "Are you sure you want to delete All products ?",
      {
        reply_markup: {
          keyboard: [["✅️Yes", "❎️No"]],
          one_time_keyboard: true,
          resize_keyboard: true,
          remove_keyboard: deleteSubMenu,
        },
      },
    );
    return;
  }
  if (deleting && msg.text == "Yes") {
    await products.deleteAll();
    bot.sendMessage(msg.chat.id, "All products are purged ☄️");
  }
};
const buttons = async (bot, query) => {
  try {
    const chatId = query.message.chat.id;
    const data = query.data;
    const [action, productId] = data.split(":");
    if (action == "edit") {
    }
    if (action == "delete") {
      const del = await products.findByIdAndDelete(productId);
      bot.sendMessage(chatId, "Product deleted successfully");
    }
  } catch (err) {
    bot.sendMessage(chatId, err);
    console.log(err);
  }
};
module.exports = { start, help, list, available, initiate_Add, add, buttons };

const products = require("../../models/productsModel");
let isAdding = false;
let step = "none";
let newProduct = {};
const Admin_start = (bot, msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Welcome to the admin panel.🏖\n Use the buttons in the keyboard to interact with me.💻",
    {
      reply_markup: {
        keyboard: [
          ["📦View products", "➕️Add products"],
          ["📝Edit products", "✖️Delete products"],
        ],
        one_time_keyboard: false,
        resize_keyboard: true,
      },
    },
  );
};
const Admin_keyButtons = async (bot, msg) => {
  if (msg.text == "📦View products") {
    const adminId = msg.from.id;
    const data = await products.find({ sellerId: adminId }).sort({ createdAt: -1 });
    if (data.length === 0 ){
      bot.sendMessage(msg.chat.id, "No products found.🗑", {reply_markup: {keyboard: [["🏠Back to main menu"]], one_time_keyboard: true, resize_keyboard: true}});    
       return;
  }
  if (msg.text == "➕️Add products") {
    const chatId = msg.chat.id;
    const adminId = msg.from.id;
    isAdding = true;
    newProduct[chatId] = {};
    step = "name";
    bot.sendMessage(chatId, "What is the name of the product");
    return;
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
      const fromId = msg.from.id;
      const adminId = await admins.findOne({ id: fromId });
      newProduct[chatId].seller = adminId._id;
      newProduct[chatId].sellerId = adminId.id;
      const fileId = msg.photo[msg.photo.length - 1].file_id;
      newProduct[chatId].image = fileId;
      isAdding = false;
      step = "none";
      const addedProduct = await products.create(newProduct[chatId]);
      bot.sendPhoto(msg.chat.id, fileId, {
        caption:
          "Product added successfully \n Name : " +
          newProduct[chatId].name +
          "\n Price : " +
          newProduct[chatId].price +
          "\n Category : " +
          newProduct[chatId].category +
          "\n Status: available",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📣Post", callback_data: `post:${addedProduct._id}` }],
          ],
        },
      });
      delete newProduct[chatId];
    } else {
      bot.sendMessage(msg.chat.id, "Please upload a picture of the product");
    }
  }

  if (
    msg.text == "🏠Back to main menu" ||
    msg.text == "🏖 No thanks" ||
    msg.text == "🗓 Another time" ||
    msg.text == "❎️No"
  ) {
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
  if (deleting && msg.text == "⚡️Specific") {
    categories = await products.distinct("category");
    bot.sendMessage(
      msg.chat.id,
      "From which category would you like to remove ?",
      {
        reply_markup: {
          keyboard: [categories, ["🏠Back to main menu"]],
          one_time_keyboard: true,
          resize_keyboard: true,
        },
      },
    );
  }
  if (deleting && categories.includes(msg.text)) {
    bot.sendMessage(
      msg.chat.id,
      "Here are the products in this category, choose the to delete ☄️",
    );
    const productsByCategory = await products.find({ category: msg.text });
    productsByCategory.forEach((product) => {
      bot.sendPhoto(msg.chat.id, product.image, {
        caption: `Name: ${product.name}\nPrice: ${product.price}\nStatus: ${product.status}`,
        reply_markup: {
          inline_keyboard: [
            [{ text: "⚡️Delete", callback_data: `delete:${product._id}` }],
          ]
        },
      });
    });
  }
  if (deleting && msg.text == "🔥All") {
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
  if (deleting && msg.text == "✅️Yes") {
    deleteSubMenu = true;
    await products.deleteMany({});
    bot.sendMessage(msg.chat.id, "All products are purged ☄️", {
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
  if (deleting && msg.text == "❎️No") {
    bot.sendMessage(msg.chat.id, "Deleting cancelled 💾");
  }
}
}
const Admin_inline = async (bot, query) => {
  const data = query.data;
  const [action, value] = data.split(":");
  if (action == "delete") {
    const del = await products.findByIdAndDelete(value);
    bot.sendMessage(query.message.chat.id, "Product deleted successfully☄️");
  }
  if ( action == "post"){
    const product = await products.findById(value);
    const pageId = await admins.findById(product.seller).populate("page");
    bot.sendPhoto(pageId.id, product.image, { caption: `Name: ${product.name}\nPrice: ${product.price}\nCategory: ${product.category}\nStatus: ${product.status}`, reply_markup:{ inline_keyboard: [[{text: "🛍Order", callback_data: `Order:${product._id}`}]]}} );
  }
  
};
module.exports = { Admin_start, Admin_keyButtons, Admin_inline }
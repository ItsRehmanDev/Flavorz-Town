const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  dishName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  address: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);

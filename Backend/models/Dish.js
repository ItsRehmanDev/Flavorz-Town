
const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: Number,
  desc: String,
  city: String,
  category: String,
});

module.exports = mongoose.model("Dish", dishSchema);

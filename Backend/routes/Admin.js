const express = require("express");
const router = express.Router();
const Dish = require("../models/Dish");

// Add new dish
router.post("/", async (req, res) => {
  try {
    const { name, image, price, desc, city, category } = req.body;
    const newDish = new Dish({ name, image, price, desc, city, category });
    await newDish.save();
    res.json({ message: "Dish created ✅", dish: newDish });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

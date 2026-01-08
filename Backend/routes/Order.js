const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/", async (req, res) => {
  try {
    const { userEmail, userName, address, cart } = req.body;
    
    if (!userEmail || !userName || !address || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ success: false, message: "Missing fields or empty cart!" });
    }

  
    const email = userEmail.toLowerCase();

    const docs = cart.map((item) => ({
      userEmail: email,
      userName,
      dishName: item.name || item.dishName || "Untitled",
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      address,
      date: new Date(),
    }));

    await Order.insertMany(docs);
    return res.json({ success: true, message: "Orders saved successfully!" });
  } catch (err) {
    console.error("POST /order error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    const orders = await Order.find({ userEmail: email.toLowerCase() }).sort({ date: -1 });
    return res.json({ success: true, orders });
  } catch (err) {
    console.error("GET /order error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;

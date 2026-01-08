const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());


const authRoutes = require("./routes/Auth");
const dishRoutes = require("./routes/Dishes");
const orderRoutes = require("./routes/Order");
const adminRoutes = require("./routes/Admin");
const Order = require("./models/Order");

app.use("/", authRoutes);
app.use("/dishes", dishRoutes);
app.use("/order", orderRoutes);
app.use("/admin", adminRoutes);
app.use("/order", require("./routes/Delete")); 

mongoose.connect("mongodb+srv://abdul:flavor@cluster0.vuh9qbd.mongodb.net/flavortown?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch(err => console.log("❌ DB Error:", err));

const PORT = 4500;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

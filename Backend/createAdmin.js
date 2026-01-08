const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

// MongoDB Atlas connection string
const MONGO_URI = "mongodb+srv://abdul:flavor@cluster0.vuh9qbd.mongodb.net/flavortown?retryWrites=true&w=majority&appName=Cluster0";

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
    
    if (existingAdmin) {
      console.log("⚠️ Admin user already exists!");
      
      // Update password for existing admin
      const hashedPassword = await bcrypt.hash("12345678", 10);
      existingAdmin.password = hashedPassword;
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log("✅ Admin password updated successfully!");
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash("12345678", 10);
      
      const admin = new User({
        name: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin"
      });

      await admin.save();
      console.log("✅ Admin user created successfully!");
    }

    console.log("\n📧 Email: admin@gmail.com");
    console.log("🔒 Password: 12345678");
    console.log("👤 Role: admin\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createAdmin();

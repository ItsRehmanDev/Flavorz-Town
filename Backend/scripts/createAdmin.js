const mongoose = require('mongoose');
const connectDatabase = require('../src/config/database');
const User = require('../src/models/User');
const { hashPassword } = require('../src/utils/password');
const config = require('../src/config/env');

const createAdmin = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: config.admin.email });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await hashPassword(config.admin.password);
    
    const admin = new User({
      name: 'Administrator',
      email: config.admin.email,
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      emailVerified: true
    });

    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log(`   Email: ${config.admin.email}`);
    console.log(`   Password: ${config.admin.password}`);
    console.log('');
    console.log('⚠️  IMPORTANT: Change the default password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

createAdmin();

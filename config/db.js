const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Adjust the path to your User model

require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    // Call the admin creation logic after the database connection
    await createAdmin();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Create an admin user

const createAdmin = async () => {
  const email = 'admin@wup.com';
  const password = 'admin@123';
  const name = 'Wesleyan Administrator';

  try {
    // Check if the admin user already exists
    const existingAdmin = await User.findOne({ email, role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create the admin user with plain-text password (bcrypt handles hashing)
    const admin = new User({
      name,
      email,
      password,  // Directly pass plain-text password
      role: 'admin',
    });

    await admin.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Export the `connectDB` function
module.exports = connectDB;

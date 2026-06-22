const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../src/config/db');
const Admin = require('../src/models/Admin');

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = 'admin@example.com';
    const password = 'admin123';

    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      console.log('Default admin already exists');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await Admin.create({
      email,
      password: hashedPassword
    });

    console.log('Default admin created successfully');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } catch (error) {
    console.error(`Failed to create default admin: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedAdmin();

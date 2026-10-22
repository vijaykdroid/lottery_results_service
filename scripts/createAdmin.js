require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = "vijaykdroid@gmail.com";
    const password = "Abcd!2345";

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists.");
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await Admin.create({
      username: "admin",
      email,
      passwordHash,
      role: "admin",
      isActive: true
    });

    console.log("First admin created successfully.");
  } catch (error) {
    console.error("Error creating admin:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/user.model");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists");
      process.exit();
    }

    const admin = new User({
      name: "Super Admin",
      email: "admin@logintel.com",
      password: "Admin@techf",  
      role: "admin",
      status: "approved",
      activity: "active",
    });

    await admin.save();

    console.log("✅ Admin seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
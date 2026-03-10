// models/user.model.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


// create a schema for users
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    status: {
      type: String,
      enum: ["pending", "approved", "inactive"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// Hash password before saving
// Uncomment the following line if you want to hash the password for admin during seeding
// userSchema.pre("save", async function (next) {
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });


// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};    


module.exports = mongoose.model("User", userSchema);

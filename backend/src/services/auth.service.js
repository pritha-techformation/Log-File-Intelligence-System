const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { generateToken } = require("../config/jwt");

exports.signup = async (data) => {

  const { password, confirmPassword } = data;

  const user = await User.findOne({ email: data.email });
  if (user) throw new Error("User already exists");


  if (confirmPassword !== password) {
    throw new Error("Passwords do not match");
  } else {
    const hashed = await bcrypt.hash(data.password, 10); // data.password;

    return await User.create({
      ...data,
      password: hashed,
    });
  }
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email });
  console.log("User authenticated:", user.email);
  console.log("user password hash:", user.password);

  if (!user) throw new Error("User not found");
  if (user.status !== "approved") throw new Error("User not approved");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  // inside login
  const token = generateToken({
    id: user._id,
    role: user.role,
  });

  console.log("Generated JWT:", token);
  return { user, token };
};

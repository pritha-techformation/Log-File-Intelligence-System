// services/auth.service.js
const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/user.repository");
const { generateToken } = require("../config/jwt");
const AppError = require("../errors/app.error");

// Authentication Service
class AuthService {

  // Signup user
  async signup(data) {

    // Check if user already exists using the email
    const existingUser = await userRepository.findByEmail(data.email);

    // Throw error if user already exists
    if (existingUser) {
      throw new AppError("User already exists", 409);
    }

    // Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user in the database with hashed password keep default status as pending
    const user = await userRepository.createUser({
      ...data,
      password: hashedPassword,
      status: "pending"
    });

    // Return created user
    return user;
  }


  // Login user
  async login(email, password) {

    // Check if user exists using email
    const user = await userRepository.findByEmail(email);

    // Throw error if user not found
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Throw error if user is inactive
    if (user.status === "inactive") {
      throw new AppError("User is inactive. Contact admin", 403);
    }

    // Throw error if user is not approved
    if (user.status !== "approved" && user.status !== "active") {
      throw new AppError("User not approved", 403);
    }

    // Check if password is correct
    const match = await bcrypt.compare(password, user.password);

    // Throw error if password is incorrect
    if (!match) {
      throw new AppError("Invalid credentials", 401);
    }

    // Generate JWT token using user id and role
    const token = generateToken({
      id: user._id,
      role: user.role,
    });

    // Return user and token
    return { user, token };
  }
}

module.exports = new AuthService();
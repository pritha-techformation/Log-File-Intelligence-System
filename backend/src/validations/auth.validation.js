// validations/auth.validation.js
const AppError = require("../errors/app.error");

exports.validateSignup = (data) => {
  // Destructure email, password, and confirmPassword from data
  const { email, password, confirmPassword } = data;

  // Throw error if any of email, password, or confirmPassword is missing
  if (!email || !password || !confirmPassword) {
    throw new AppError("All fields are required");
  }

  // Throw error if password and confirmPassword do not match
  if (password !== confirmPassword) {
    throw new AppError("Passwords do not match");
  }

  // Throw error if password is less than 6 characters
  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters long");
  }
};

// Login validation
exports.validateLogin = (data) => {
  // Destructure email and password from data
  const { email, password } = data;

  // Throw error if email or password is missing
  if (!email || !password) {
    throw new AppError("Email and password required");
  }
};
const AppError = require("../errors/app.error");

exports.validateSignup = (data) => {
  const { email, password, confirmPassword } = data;

  if (!email || !password || !confirmPassword) {
    throw new AppError("All fields are required");
  }

  if (password !== confirmPassword) {
    throw new AppError("Passwords do not match");
  }

  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters long");
  }
};

exports.validateLogin = (data) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new AppError("Email and password required");
  }
};
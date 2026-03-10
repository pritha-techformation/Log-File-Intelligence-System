const jwt = require("jsonwebtoken"); // Import jsonwebtoken library to create and verify JWT tokens

// Function to generate a JWT token
const generateToken = (payload) => {

  // Check if JWT secret exists in environment variables
  // This secret key is required to sign the token securely
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in environment variables");
  }

  // Log the secret being used (useful for debugging during development)
  // ⚠ In production this should usually be removed for security reasons
  console.log("Inside generateToken, secret:", process.env.JWT_SECRET);

  // Create and return a signed JWT token
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

// Function to verify a JWT token
const verifyToken = (token) => {
  // Verify the token using the same secret key
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Export the functions so they can be used in other files
module.exports = {
  generateToken,
  verifyToken,
};
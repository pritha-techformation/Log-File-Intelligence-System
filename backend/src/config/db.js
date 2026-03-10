const mongoose = require("mongoose");

// Function to establish connection with MongoDB
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the connection string
    // stored in environment variables (process.env.MONGO_URI)
    await mongoose.connect(process.env.MONGO_URI);

    // Log success message if connection is established
    console.log("MongoDB Connected");
  } catch (error) {
    // If connection fails, print the error details to the console
    console.error("MongoDB Connection Error:", error);

    // Throw the error so it can be handled by the calling function
    throw error;
  }
};

// Export the connectDB function so it can be used in other files
// (called in server.js when the application starts)
module.exports = connectDB;
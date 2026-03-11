require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

// Connect to MongoDB
connectDB();

// export the app
module.exports = app;

require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

// Connect to MongoDB
connectDB();

// Start the server
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
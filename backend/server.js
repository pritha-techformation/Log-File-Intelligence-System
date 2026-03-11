require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

// Connect to MongoDB
connectDB();

// export the app
const PORT = process.env.PORT || 8000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
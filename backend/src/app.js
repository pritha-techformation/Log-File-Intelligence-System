// app.js
const express = require("express");
const cors = require("cors");

// Routes imports
const authRoutes = require("./routes/auth.routes");
const logRoutes = require("./routes/log.routes");
const errorHandler = require("./middleware/error.middleware");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");


// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: "https://log-file-intelligence-system-9fa5.vercel.app/",
  credentials: true
}));
app.use(express.json());

// Routes 
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/admin", adminRoutes);
app.use(errorHandler);


module.exports = app;
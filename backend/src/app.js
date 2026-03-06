const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const logRoutes = require("./routes/log.routes");
const errorHandler = require("./middleware/error.middleware");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");




const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/admin", adminRoutes);
app.use(errorHandler);


module.exports = app;
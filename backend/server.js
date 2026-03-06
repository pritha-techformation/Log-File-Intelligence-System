require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

connectDB();


console.log("JWT SECRET:", process.env.JWT_SECRET);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
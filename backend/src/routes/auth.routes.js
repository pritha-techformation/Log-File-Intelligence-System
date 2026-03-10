// routes/auth.routes.js

const router = require("express").Router();
const controller = require("../controllers/auth.controller");

// Signup & Login
router.post("/signup", controller.signup);
router.post("/login", controller.login);

module.exports = router;
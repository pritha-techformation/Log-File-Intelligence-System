const authService = require("../services/auth.service");

exports.signup = async (req, res) => {
  const user = await authService.signup(req.body);
  res.json({ message: "Signup successful. Await admin approval." });
};

exports.login = async (req, res) => {
  try {
    const data = await authService.login(req.body.email, req.body.password);
    res.json(data);
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(400).json({ message: error.message });
  }
};
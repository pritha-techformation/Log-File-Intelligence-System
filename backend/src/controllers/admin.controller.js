const User = require("../models/user.model");

// Get admin profile
exports.getProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select("-password");
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update admin profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const updatedAdmin = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select("-password");

    res.json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
const User = require("../models/user.model");

// Get admin profile
exports.getProfile = async (req, res) => {
  try {

    // Get admin profile by id and exclude password
    const admin = await User.findById(req.user.id).select("-password");

    // Return admin profile
    res.json(admin);
  } catch (error) {

    // Return server error
    res.status(500).json({ message: "Server error" });
  }
};

// Update admin profile
exports.updateProfile = async (req, res) => {
  try {

    // Get name and email from request body
    const { name, email } = req.body;

    // Update admin profile and exclude password
    const updatedAdmin = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select("-password");

    // Return updated admin profile
    res.json(updatedAdmin);
  } catch (error) {

    // Return server error
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStats = async (req, res) => {
  const total = await User.countDocuments();
  // const active = await User.countDocuments({ status: "active" });
  const inactive = await User.countDocuments({ status: "inactive" });
  const pending = await User.countDocuments({ status: "pending" });
  const approved = await User.countDocuments({ status: "approved" });

  const latestPending = await User.find({ status: "pending" })
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    total,
    // active,
    inactive,
    pending,
    approved,
    latestPending
  });
};
const User = require("../models/user.model");

// Get all users with pagination & search
const paginationUtil = require("../utils/pagination.util");

exports.getUsers = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const search = req.query.search || "";

  const query = {
    email: { $regex: search, $options: "i" },
  };

  const total = await User.countDocuments(query);

  const users = await User.find(query)
    .select("-password")
    .skip((page - 1) * limit)
    .limit(limit);

  const pagination = paginationUtil(page, limit, total);

  res.json({
    success: true,
    users,
    total,
    pagination,
  });
};

// Approve user
exports.approveUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    status: "approved",
  });

  res.json({ success: true, message: "User approved" });
};

// Mark inactive
exports.markInactive = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    activity: "inactive",
  });

  res.json({ success: true, message: "User marked inactive" });
};

// Delete user
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: "User deleted" });
};
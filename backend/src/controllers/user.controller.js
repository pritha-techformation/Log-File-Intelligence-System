const User = require("../models/user.model");
// Get all users with pagination & search
const paginationUtil = require("../utils/pagination.util");

// Get all users
exports.getUsers = async (req, res) => {
  try {
    // Build query
    const query = {};

    // Get page, limit, search and status
    const { page = 1, limit = 5, search = "", status } = req.query;

    // Convert to number
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    // Apply search
    if (search) {
      query.email = { $regex: search, $options: "i" };
    }

    // Apply status
    if (status) {
      query.status = status;
    }

    // Count total
    const total = await User.countDocuments(query);

    // Get users excluding password and apply pagination
    const users = await User.find(query)
      .select("-password")
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

      // Get pagination
    const pagination = paginationUtil(pageNumber, limitNumber, total);

    // Return response
    res.json({
      success: true,
      users,
      total,
      pagination,
    });

  } catch (error) {

    // Return server error
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Approve user
exports.approveUser = async (req, res) => {
  // Update user status to approved finding by ID
  await User.findByIdAndUpdate(req.params.id, {
    status: "approved",
  });

  // Return response
  res.json({ success: true, message: "User approved" });
};

// Mark inactive
exports.markInactive = async (req, res) => {

  // Update user activity status to inactive
  await User.findByIdAndUpdate(req.params.id, {
    activity: "inactive",
  });

  // Return response
  res.json({ success: true, message: "User marked inactive" });
};

// Mark active
exports.markActive = async (req, res) => {
  // Update user activity status to active
  await User.findByIdAndUpdate(req.params.id, {
    activity: "active",
  });

  res.json({ success: true, message: "User marked active" });
};

// Delete user
exports.deleteUser = async (req, res) => {
  // Delete user finding by ID
  await User.findByIdAndDelete(req.params.id);

  // Return response
  res.json({ success: true, message: "User deleted" });
};

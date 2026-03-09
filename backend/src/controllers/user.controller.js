const User = require("../models/user.model");

// Get all users with pagination & search
const paginationUtil = require("../utils/pagination.util");

exports.getUsers = async (req, res) => {
  try {
    const query = {};

    const { page = 1, limit = 5, search = "", status } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (search) {
      query.email = { $regex: search, $options: "i" };
    }

    if (status) {
      query.status = status;
    }

    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .select("-password")
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const pagination = paginationUtil(pageNumber, limitNumber, total);

    res.json({
      success: true,
      users,
      total,
      pagination,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
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

exports.markActive = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    activity: "active",
  });

  res.json({ success: true, message: "User marked active" });
};

// Delete user
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: "User deleted" });
};

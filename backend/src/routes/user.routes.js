// routes/user.routes.js
const router = require("express").Router();

const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const controller = require("../controllers/user.controller");

// Get all users (with optional pagination & search)
router.get(
  "/",
  auth,
  authorize(["admin"]),
  controller.getUsers
);

// Approve user
router.patch(
  "/:id/approve",
  auth,
  authorize(["admin"]),
  controller.approveUser
);

// Mark user inactive
router.patch(
  "/:id/inactive",
  auth,
  authorize(["admin"]),
  controller.markInactive
);

// Mark user active
router.patch(
  "/:id/active",
  auth,
  authorize(["admin"]),
  controller.approveUser
);

// Delete user
router.delete(
  "/:id",
  auth,
  authorize(["admin"]),
  controller.deleteUser
);

module.exports = router;
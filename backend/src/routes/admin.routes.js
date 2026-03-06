const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const controller = require("../controllers/admin.controller");

// Get logged-in admin profile
router.get(
  "/dashboard",
  auth,
  authorize(["admin"]),
  controller.getProfile
);

// Update logged-in admin profile
router.put(
  "/profile",
  auth,
  authorize(["admin"]),
  controller.updateProfile
);

module.exports = router;
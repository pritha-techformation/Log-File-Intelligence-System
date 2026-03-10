// routes/log.routes.js

const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const controller = require("../controllers/log.controller");

// Upload log
router.post("/upload", auth, upload.single("file"), controller.uploadLog);

// Get own logs
router.get("/my", auth, controller.getMyLogs);

// Get all logs
router.get("/alllogs", auth, controller.getAllLogs);

// Get log by id
router.get("/:id", auth, controller.getLogById);


module.exports = router;
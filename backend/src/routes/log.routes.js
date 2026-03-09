const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const controller = require("../controllers/log.controller");

router.post("/upload", auth, upload.single("file"), controller.uploadLog);
router.get("/my", auth, controller.getMyLogs);
router.get("/alllogs", auth, controller.getAllLogs);
router.get("/:id", auth, controller.getLogById);
router.get("/report/:id", controller.getPublicReport);

module.exports = router;
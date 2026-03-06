const express = require("express");
const router = express.Router();

const fileMiddleware = require("../middleware/file");
const { auth } = require("../middleware/auth");
const {
  getNotifications,
  readNotifications,
  readNotification,
} = require("../controllers/notifications");

router.get("/", auth, getNotifications);
router.put("/read", auth, readNotifications);
router.put("/read/:id", auth, readNotification);

module.exports = router;

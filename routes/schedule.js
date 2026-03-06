const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");
const {
  getSchedules,
  createSchedule,
  deactivateSchedule,
} = require("../controllers/schedule");

router.get("/", auth, getSchedules);
router.post("/", auth, createSchedule);
router.put("/", auth, deactivateSchedule);
module.exports = router;

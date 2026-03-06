const express = require("express");
const router = express.Router();

const fileMiddleware = require("../middleware/file");
const { auth } = require("../middleware/auth");
const {
  createReport,
  getReportsForProduct,
  getReports,
} = require("../controllers/reports");

router.post("/", auth, fileMiddleware.single("file"), createReport);
router.get("/:productId", auth, getReportsForProduct);
router.get("/", auth, getReports);

module.exports = router;

const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");
const fileMiddleware = require("../middleware/file");

const {
  createReport,
  getReportsForProduct,
  getReports,
} = require("../controllers/reports");

router.post("/", auth, fileMiddleware.single("file"), createReport);
router.get("/product/:productId", auth, getReportsForProduct);
router.get("/", auth, getReports);

module.exports = router;

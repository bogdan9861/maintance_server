const express = require("express");
const router = express.Router();

const { pay } = require("../controllers/payment");
const { auth } = require("../middleware/auth");

router.post("/", auth, pay);

module.exports = router;

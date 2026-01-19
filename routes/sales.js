const express = require("express");
const router = express.Router();

const { get } = require("../controllers/sales");

router.get("/", get);

module.exports = router;

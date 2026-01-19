const express = require("express");
const router = express.Router();

const { getAll } = require("../controllers/categories");

router.get("/", getAll);

module.exports = router;

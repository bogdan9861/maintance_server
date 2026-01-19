const express = require("express");
const router = express.Router();

const { create, get } = require("../controllers/reviews");
const { auth } = require("../middleware/auth");

router.post("/", auth, create);
router.get("/", auth, get);

module.exports = router;

const express = require("express");
const router = express.Router();

const { add, get, remove } = require("../controllers/cart");
const { auth } = require("../middleware/auth");

router.post("/", auth, add);
router.get("/", auth, get);
router.delete("/:id", auth, remove);

module.exports = router;

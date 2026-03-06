const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");
const {
  getTemplates,
  createTemplate,
  deleteTemplate,
} = require("../controllers/maintenance");

router.get("/", auth, getTemplates);
router.post("/", auth, createTemplate);
router.delete("/:id", auth, deleteTemplate);

module.exports = router;

const express = require("express");
const router = express.Router();

const fileMiddleware = require("../middleware/file");
const { auth } = require("../middleware/auth");
const {
  getProducts,
  createProduct,
  deleteProduct,
  getProductById,
  editProduct,
} = require("../controllers/products");

router.get("/", auth, getProducts);
router.get("/:id", auth, getProductById);
router.post("/", auth, fileMiddleware.single("image"), createProduct);
router.put("/edit", auth, editProduct);
router.delete("/:id", auth, deleteProduct);

module.exports = router;

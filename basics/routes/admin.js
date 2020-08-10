const express = require("express");
const path = require("path");

const router = express.Router();

const adminController = require("../controllers/admin");
router.get("/add-product", adminController.getAddProduct);

router.get("/edit-product/:productId", adminController.getEditProduct);

router.post("/add-product", adminController.postAddProduct);
router.post("/edit-product", adminController.postEditProduct);
router.post("/delete-product", adminController.deleteProduct);

router.get("/products", adminController.getProducts);

module.exports = router;
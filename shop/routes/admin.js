const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const adminController = require("../controllers/admin");

router.get("/add-product", isAuth, adminController.getAddProduct);
router.post("/add-product", isAuth, adminController.postAddProduct);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);
router.post("/edit-product", isAuth, adminController.postEditProduct);

router.post("/delete-product", isAuth, adminController.deleteProduct);

router.get("/products", adminController.getProducts);

module.exports = router;

const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const adminController = require("../controllers/admin");
const { body } = require("express-validator/check");

router.get("/add-product", isAuth, adminController.getAddProduct);
router.post(
  "/add-product",
  [
    body("title", "Please enter a title between 3-25 chars")
      .trim()
      .isString()
      .isLength({ min: 3, max: 25 }),
    body("imageUrl")
      .isURL()
      .withMessage("Enter a valid URL"),
    body("price")
      .isNumeric()
      .withMessage("Enter a valid price"),
    body("description", "Please enter a description between 3-180 chars")
      .trim()
      .isLength({ min: 3, max: 180 })
  ],
  isAuth,
  adminController.postAddProduct
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);
router.post(
  "/edit-product",
  [
    body("title", "Please enter a title between 3-25 chars")
      .trim()
      .isString()
      .isLength({ min: 3, max: 25 }),
    body("imageUrl")
      .isURL()
      .withMessage("Enter a valid URL"),
    body("price")
      .isNumeric()
      .withMessage("Enter a valid price"),
    body("description", "Please enter a description between 3-180 chars")
      .trim()
      .isLength({ min: 3, max: 180 })
  ],
  isAuth,
  adminController.postEditProduct
);

router.delete("/product/:productId", isAuth, adminController.deleteProduct);

router.get("/products", adminController.getProducts);

module.exports = router;

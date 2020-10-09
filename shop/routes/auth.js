const express = require("express");
const { check, body } = require("express-validator/check");
const router = express.Router();
const User = require("../models/user");

const authController = require("../controllers/auth");

router.get("/login", authController.getLogin);
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Enter a valid email"),

    body("password")
      .isLength({ min: 5 })
      .isAlphanumeric()
  ],
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject("E-mail already exists!");
          }
        });
      }),

    body(
      "password",
      "Please enter an alphanumeric password with at least 5 chars"
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),

    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match!");
      }
      return true;
    })
  ],
  authController.postSignup
);

module.exports = router;

const express = require("express");
const router = express.Router();

const { body } = require("express-validator");

const feedController = require("../controllers/feed");
router.get("/posts", feedController.getPosts);
router.post(
  "/post",
  [
    body("title", "Please enter a valid title!")
      .trim()
      .isString()
      .isLength({ min: 5 }),
    body("content", "Please enter a valid content!")
      .trim()
      .isString()
      .isLength({ min: 5 })
  ],
  feedController.createPost
);

module.exports = router;

const express = require("express");
const router = express.Router();

const { body } = require("express-validator");

const feedController = require("../controllers/feed");
const isAuth = require("../middleware/is-auth");
router.get("/posts", isAuth, feedController.getPosts);
router.post(
  "/post",
  isAuth,
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

router.get("/posts/:postId", isAuth, feedController.getPost);
router.put("/posts/:postId", isAuth, feedController.editPost);
router.delete("/posts/:postId", isAuth, feedController.deletePost);

module.exports = router;

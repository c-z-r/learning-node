const { validationResult } = require("express-validator");
const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  Post.find()
    .then(result => {
      res.status(200).json({
        message: "Posts fetched",
        posts: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed!");
    error.statusCode = 422;
    throw error;
  }

  const { title, content } = req.body;

  const post = new Post({
    title: title,
    content: content,
    imageUrl: "/images/hack.png",
    creator: {
      name: "CZR"
    }
  });

  post
    .save()
    .then(result => {
      res.status(201).json({
        message: "Post created!",
        post: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const id = req.params.postId;
  Post.findById(id)
    .then(post => {
      if (!post) {
        const error = new Error("Could not find post with id " + id);
        error.statusCode = 404;
        throw error; // goes to the next .catch()
      } else {
        res.status(200).json({
          message: "Post fetched!",
          post: post
        });
      }
    })
    .catch(error => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

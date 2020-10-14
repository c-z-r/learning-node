const { validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");

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
  let creator;

  const post = new Post({
    title: title,
    content: content,
    imageUrl: "/images/hack.png",
    creator: req.userId
  });

  post
    .save()
    .then(result => {
      return User.findById(req.userId);
    })
    .then(user => {
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then(result => {
      res.status(201).json({
        message: "Post created!",
        post: post,
        creator: { _id: creator._id, name: creator.name }
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

exports.editPost = (req, res, next) => {
  const id = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed!");
    error.statusCode = 422;
    throw error;
  }

  //switch to find post . then check then save()
  Post.findOneAndUpdate(
    { _id: id },
    {
      title: req.body.title,
      content: req.body.content
    },
    { new: true }
  )
    .then(result => {
      if (!result) {
        const error = new Error("Could not find post with id " + id);
        error.statusCode = 404;
        throw error;
      }

      // if(result.creator.toString() !== req.userId){
      //   const error = new Error("Not authorized");
      //   error.statusCode = 403;
      //   throw error;
      // }

      res.status(200).json({
        message: "Post updated!",
        post: result
      });
    })
    .catch(error => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.deletePost = (req, res, next) => {
  const id = req.params.postId;
  Post.findOneAndDelete({ _id: id })
    .then(result => {
      return User.findById(req.userId);
    })
    .then(user => {
      user.posts.pull(id);
      return user.save();
    })
    .then(result => {
      res.status(200).json({ message: "Post deleted!" });
    })
    .catch(error => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

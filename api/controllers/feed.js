const { validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json({
      message: "Posts fetched",
      posts: posts
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
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

  try {
    await post.save();
    let user = await User.findById(req.userId);
    creator = user;
    user.posts.push(post);
    user = await user.save();
    res.status(201).json({
      message: "Post created!",
      post: post,
      creator: { _id: creator._id, name: creator.name }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  const id = req.params.postId;

  try {
    const post = await Post.findById(id);
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
  } catch (err) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.editPost = async (req, res, next) => {
  const id = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed!");
    error.statusCode = 422;
    throw error;
  }

  //switch to find post . then check then save()
  try {
    const post = await Post.findOneAndUpdate(
      { _id: id },
      {
        title: req.body.title,
        content: req.body.content
      },
      { new: true }
    );

    if (!post) {
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
      post: post
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const id = req.params.postId;

  try {
    await Post.findOneAndDelete({ _id: id });
    const user = await User.findById(req.userId);
    user.posts.pull(id);
    await user.save();
    res.status(200).json({ message: "Post deleted!" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

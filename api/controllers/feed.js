const { validationResult } = require("express-validator");

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        title: "First post",
        content: "First post desc",
        imageUrl: "images/hack.png",
        creator: {
          name: "CZR"
        },
        createdAt: new Date()
      }
    ]
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      message: "Validation failed!",
      errors: errors.array()
    });
  }

  const { title, content } = req.body;

  res.status(200).json({
    message: "Post created!",
    post: {
      id: new Date().toISOString(),
      title: title,
      content: content,
      creator: {
        name: "CZR"
      },
      createdAt: new Date()
    }
  });
};

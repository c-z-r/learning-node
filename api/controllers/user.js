const User = require("../models/user");

exports.getStatus = (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
    .then(user => {
      if (!user) {
        const err = new Error("User does not exist");
        err.statusCode = 404;
        throw err;
      }

      res.status(200).json({
        userId: user._id,
        status: user.status
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next();
    });
};

exports.updateStatus = (req, res, next) => {
  const userId = req.userId;
  const newStatus = req.body.status;
  User.findById(userId)
    .then(user => {
      if (!user) {
        const err = new Error("User does not exist");
        err.statusCode = 404;
        throw err;
      }

      user.status = newStatus;
      return user.save();
    })
    .then(user => {
      res.status(200).json({
        userId: user._id,
        status: user.status
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next();
    });
};

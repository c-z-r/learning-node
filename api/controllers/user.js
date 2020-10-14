const User = require("../models/user");

exports.getStatus = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const err = new Error("User does not exist");
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      userId: user._id,
      status: user.status
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next();
  }
};

exports.updateStatus = async (req, res, next) => {
  const userId = req.userId;
  const newStatus = req.body.status;

  try {
    let user = await User.findById(userId);
    if (!user) {
      const err = new Error("User does not exist");
      err.statusCode = 404;
      throw err;
    }

    user.status = newStatus;
    user = await user.save();
    res.status(200).json({
      userId: user._id,
      status: user.status
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next();
  }
};

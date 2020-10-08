const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postLogin = (req, res) => {
  User.findById("5f7c4b14ba3cef0ae2e44ffa")
    .then(user => {
      req.session.user = user;
      req.session.isLoggedIn = true;
      req.session.save(err => {
        res.redirect("/");
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res) => {
  console.log(req.session);
  req.session.destroy(err => {
    console.log("err: " + err);
    res.redirect("/");
  });
};

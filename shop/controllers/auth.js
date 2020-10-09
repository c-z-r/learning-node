const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator/check");

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: message,
    oldInput: {
      email: "",
      password: ""
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res) => {
  const email = req.body.email;
  const pass = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: pass
      },
      validationErrors: []
    });
  }

  User.findOne({ email: email })
    .then(userDoc => {
      if (!userDoc) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
      }

      bcrypt
        .compare(pass, userDoc.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.user = userDoc;
            req.session.isLoggedIn = true;
            return req.session.save(err => {
              res.redirect("/");
            });
          } else {
            req.flash("error", "Invalid email or password");
            res.redirect("/login");
          }
        })
        .catch(err => {
          res.redirect("/login");
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogout = (req, res) => {
  req.session.destroy(err => {
    console.log("err: " + err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/signup", {
    pageTitle: "Signup",
    path: "/signup",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: ""
    },
    validationErrors: []
  });
};

exports.postSignup = (req, res) => {
  const email = req.body.email;
  const pass = req.body.password;

  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      pageTitle: "Signup",
      path: "/signup",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: pass,
        confirmPassword: req.body.confirmPassword
      },
      validationErrors: []
    });
  }

  return bcrypt
    .hash(pass, 12)
    .then(hashedPass => {
      const user = User({
        email: email,
        password: hashedPass,
        cart: { items: [] }
      });
      return user.save();
    })
    .then(result => {
      res.redirect("/login");
    });
};

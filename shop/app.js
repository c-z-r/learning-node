const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const path = require("path");
const errorController = require("./controllers/error");
const mongoose = require("mongoose");

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("5f7c4b14ba3cef0ae2e44ffa")
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://czr:IdRJowB9N0pVEAO8@cluster0.lolcv.mongodb.net/udemy?retryWrites=true&w=majority"
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        new User({
          username: "czr",
          email: "czr@thin.com",
          cart: { items: [] }
        }).save();
      }
    });

    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });

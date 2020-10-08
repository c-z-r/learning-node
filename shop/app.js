const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const path = require("path");
const errorController = require("./controllers/error");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const MONGODB_URI =
  "mongodb+srv://czr:IdRJowB9N0pVEAO8@cluster0.lolcv.mongodb.net/udemy";

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions"
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "mylongsecret",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);


app.use((req, res, next) => {
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
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
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
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

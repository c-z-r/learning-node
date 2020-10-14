const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const path = require("path");
app.use("/images", express.static(path.join(__dirname, "images")));

const feedRouter = require("./routes/feed");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(feedRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode || 500).json({ message: err.message, data: err.data });
});

const mongoose = require("mongoose");
const MONGODB_URI =
  "mongodb+srv://czr:IdRJowB9N0pVEAO8@cluster0.lolcv.mongodb.net/messages";
mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(port);
  })
  .catch(err => {
    console.log(err);
  });

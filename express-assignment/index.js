const express = require("express");
const app = express();


app.use("/users", (req, res, next) => {
  console.log("reached users middleware");
  res.send('<h1>vasile este cel mai user</h1>')
});

app.use("/", (req, res, next) => {
  console.log("reached app middleware");
  res.send('<h1>Welcome to my app</h1>')
});

app.listen(3000);

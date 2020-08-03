const express = require("express");
const app = express();

const path = require("path");

app.use(express.static(path.join(__dirname, 'public')));

app.use("/one", (req, res, next) => {
    res.sendFile(path.join(__dirname, "one.html"))
});
app.use("/two", (req, res, next) => {
    res.sendFile(path.join(__dirname, "two.html"))
});

app.listen(3000);
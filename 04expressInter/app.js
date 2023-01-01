const express = require("express");

const app = express();

var middle = function (req, res, next) {
  req.requestTime = Date.now();
  next();
};
app.use(middle);
app.get("/", (req, res) => {
  res.send("Hello world " + req.requestTime);
});

app.listen(3000, () => console.log("Server is running at 3000..."));

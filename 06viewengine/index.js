const express = require("express");
const path = require("path");

const app = express();

var port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views")); // this line is optional
console.log("current directory is " + __dirname);

app.set("view engine", "pug");
app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => console.log(`Server is running at ${port}`));

const express = require("express");
const app = express();
const ejs = require("ejs");
const multer = require("multer");
const path = require("path");

const port = process.env.PORT || 3000;
// set for ejs
app.set("view engine", "ejs");

// static folder
app.use(express.static("./public")); // take the public folder from the current directory

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage }).single("profilepic");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", (req, res) => {
  upload(req, res, (error) => {
    if (error) {
      res.render("index", {
        message: error,
      });
    } else {
      res.render("index", {
        message: `your file name in our system is ${req.file.filename} and in ur system is ${req.file.originalname}`,
        filename: `uploads/${req.file.filename}`,
      });
    }
  });
});

app.listen(port, () => console.log("Server is running"));

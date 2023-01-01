const express = require("express");
const passport = require("passport");
const Strategy = require("passport-facebook").Strategy;

passport.use(
  new Strategy(
    {
      clientID: "1808585732849461",
      clientSecret: "c6c04cd5a0b6676bbf7e4e26ee36cbda",
      callbackURL: "http://localhost:3000/login/facebook/return",
    },
    function (accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

const app = express();
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(require("morgan")("combined"));
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(
  require("express-session")({
    secret: "node app",
    resave: true,
    saveUninitialized: true,
  })
);

//@route -  GET  /
//@desc  -  route to home page
//@access - PUBLIC
app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

//@route -  GET  /login
//@desc  -  route to login
//@access - PUBLIC
app.get("/login", (req, res) => {
  res.render("login");
});

//@route -  GET  /login/facebook
//@desc  -  route to facebook auth
//@access - PUBLIC
app.get("/login/facebook", (req, res) => {
  passport.authenticate("facebook");
});

//@route -  GET  /login/facebook/callback
//@desc  -  route to facebook auth
//@access - PUBLIC
app.get(
  "/login/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    res.render("/");
  }
);

//@route -  GET  /profile
//@desc  -  route to profile of user
//@access - PRIVATE
app.get(
  "/profile",
  require("connect-ensure-login").ensureLoggedIn(),
  (req, res) => {
    res.render("profile", { user: req.user });
  }
);

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});

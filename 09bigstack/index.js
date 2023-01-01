const express = require("express");
const passport = require("passport");
const bodyparser = require("body-parser");
const auth = require("./routes/api/auth");
const profile = require("./routes/api/profile");
const question = require("./routes/api/question");
const linuxQuestion = require("./routes/api/linuxQuestion");

const app = express();

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

const mongoose = require("mongoose");
const port = process.env.PORT || 3000;

//passport middleware
app.use(passport.initialize());

//config for JWT Strategy
require("./strategies/jsonwtStrategy")(passport);

//actual routes
app.use("/api/auth", auth);
app.use("/api/profile", profile);
app.use("/api/questions", question);
app.use("/api/linuxQuestion", linuxQuestion);

//MongoDB configuration
const db = require("./setup/myurl").mongoURL;

mongoose.set("strictQuery", true);

//Attempt to connect to database
mongoose
  .connect(db)
  .then(console.log("MongoDB connected Successfully"))
  .catch(err => console.log(err));

//@route -  GET  /
//@desc  -  route to home page
//@access - PUBLIC
// Route for testing purpose
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => console.log(`App is running at ${port}`));

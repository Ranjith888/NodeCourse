const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jsonwt = require("jsonwebtoken");
const passport = require("passport");
const mykey = require("../../setup/myurl");

// Import Person Model
const Person = require("../../models/Person");
const e = require("express");

//@type GET
//@route /api/auth
//@desc just for testing
//@access PUBLIC
router.get("/", (req, res) => {
  res.json({
    test: "Auth is success",
  });
});

//@type POST
//@route /api/auth/register
//@desc route for registration of users
//@access PUBLIC
router.post("/register", (req, res) => {
  Person.findOne({ email: req.body.email })
    .then((person) => {
      if (person) {
        return res
          .status(400)
          .json({ emailError: "Email already registered in our system" });
      } else {
        const newPerson = new Person({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          gender: req.body.gender,
        });
        if (newPerson.gender == "male") {
          newPerson.profilePic =
            "https://as1.ftcdn.net/v2/jpg/01/40/46/18/1000_F_140461899_dvRngd7xvZtqCUHLiIyRjgflq2EmwnVP.jpg";
        } else {
          newPerson.profilePic =
            "https://www.pinterest.com/pin/722546333961093205/";
        }

        //encrypt password  using bcrypt
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newPerson.password, salt, (err, hash) => {
            if (err) throw err;
            newPerson.password = hash;
            newPerson
              .save()
              .then((person) => res.json({ person }))
              .catch((err) => console.log(err));
          });
        });
      }
    })
    .catch((err) => console.log(err));
});

//@type POST
//@route /api/auth/login
//@desc route for user login
//@access PUBLIC

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  Person.findOne({ email })
    .then((person) => {
      if (!person) {
        return res
          .status(404)
          .json({ emailError: "User not found with this email" });
      }
      bcrypt.compare(password, person.password).then((isCorrect) => {
        if (isCorrect) {
          // use payload and create token for user
          const payload = {
            id: person.id,
            name: person.name,
            email: person.email,
          };
          jsonwt.sign(
            payload,
            mykey.secret,
            {
              expiresIn: 3600,
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
              });
            }
          );
        } else {
          res.status(400).json({ passwordError: "Password is not correct" });
        }
      });
    })
    .catch((err) => console.log(err));
});

//@type GET
//@route /api/auth/profile
//@desc route for user profile
//@access PRIVATE

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      profilePic: req.user.profilePic,
      gender: req.user.gender,
    });
  }
);

module.exports = router;

const mongoose = require("mongoose");

const express = require("express");

const router = express.Router();
//Load Profile model
const Profile = require("../../models/Profile");

//Load LinuxQuestion model
const LinuxQuestion = require("../../models/LinuxQuestion");
const passport = require("passport");

// @type GET
// @route /api/linuxQuestion/
// @desc route to get all the linux Question
// @access PUBLIC
router.get("/", (req, res) => {
  LinuxQuestion.find({})
    .then(lquestion => res.json(lquestion))
    .catch(err =>
      console.log("Problem in fetching all the linux question " + err)
    );
});

// @type POST
// @route /api/linuxQuestion/
// @desc route to post a question
// @access PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newQuestion = new LinuxQuestion({
      user: req.user.id,
      question: req.body.question,
      code: req.body.code
    });
    newQuestion
      .save()
      .then(newQuestion => res.json(newQuestion))
      .catch(err =>
        console.log("Problem in posting the question to db " + err)
      );
  }
);

// @type POST
// @route /api/linuxQuestion/answer/:q_id
// @desc route to post a answer for question
// @access PRIVATE
router.post(
  "/answer/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    LinuxQuestion.findById(req.params.id)
      .then(question => {
        if (!question) {
          res.status(400).json({ questionNotFound: "Question not found" });
        } else {
          const newAnswer = {
            user: req.user.id,
            text: req.body.text
          };
          question.answers.unshift(newAnswer);
          question
            .save()
            .then(question => res.json({ question }))
            .catch(err => console.log("Problem in posting the answer " + err));
        }
      })
      .catch(err =>
        console.log(
          "Problem in fetching question details with question id " + err
        )
      );
  }
);

module.exports = router;

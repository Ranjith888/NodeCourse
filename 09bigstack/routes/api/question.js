const express = require("express");
const passport = require("passport");

const router = express.Router();

//Load Person Model
const Person = require("../../models/Person");

//Load Profile Model
const Profile = require("../../models/Profile");

//Load Question Model
const Question = require("../../models/Question");

//@type   GET
//@route  /api/questions
//@desc   route to get all the questions
//@access PUBLIC
router.get("/", (req, res) => {
  Question.find()
    .sort({ date: "desc" })
    .then(questions => res.json(questions))
    .catch(err => console.log("Problem in fetching all the question " + err));
});

//@type    POST
//@route   /api/questions
//@desc    route to post a question
//@access  PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newQuestion = new Question({
      textOne: req.body.textOne,
      textTwo: req.body.textTwo,
      user: req.user.id,
      name: req.user.name
    });
    newQuestion
      .save()
      .then(question => res.json(question))
      .catch(err => console.log("Problem in posting question to db " + err));
  }
);

//@type    POST
//@route   /api/questions/answers/:id
//@desc    route to post a answer
//@access  PRIVATE
router.post(
  "/answers/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Question.findById(req.params.id)
      .then(question => {
        const newAnswer = {
          user: req.user.id,
          name: req.body.name,
          text: req.body.text
        };
        question.answer.unshift(newAnswer);
        question
          .save()
          .then(question => res.json(question))
          .catch(err => console.log("Problem in pushing answer to db " + err));
      })
      .catch(err => console.log("Problem in fetching question with id " + err));
  }
);

//@type    POST
//@route   /api/questions/upvote/:id
//@desc    route to upvote a question
//@access  PRIVATE
router.post(
  "/upvote/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Question.findById(req.params.id)
          .then(question => {
            if (
              question.upvotes.filter(
                upvote => upvote.user.toString() === req.user.id.toString()
              ).length > 0
            ) {
              // res.status(400).json({ alreadyUpvoted: "User already upvotes" });
              const removeThis = question.upvotes
                .map(upvote => upvote.user.toString())
                .indexOf(req.user.id.toString());
              console.log(question);
              console.log("user found at index " + removeThis);
              question.upvotes.splice(removeThis, 1);
              question
                .save()
                .then(question => res.json({ question }))
                .catch(err =>
                  console.log(
                    "Problem in updating the upvote in questions " + err
                  )
                );
            } else {
              question.upvotes.unshift({ user: req.user.id });
              console.log("Executed else ");
              question
                .save()
                .then(question => res.json(question))
                .catch(err =>
                  console.log("Problem in saving the upvotes " + err)
                );
            }
          })
          .catch(err =>
            console.log(
              "Problem in fetching the question details using id in params " +
                err
            )
          );
      })
      .catch(err =>
        console.log(
          "Problem in fetching profile using the user id during upvote entry " +
            err
        )
      );
  }
);

//@type    DELETE
//@route   /api/questions/:id
//@desc    route to delete question
//@access  PRIVATE

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Question.findByIdAndRemove(req.params.id)
      .then(() =>
        res.json({ success: true, delete: "question deleted successfully" })
      )
      .catch(err => console.log("No Question exist with this given id"));
  }
);

//@type    DELETE
//@route   /api/questions
//@desc    route to delete all question
//@access  PRIVATE
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Question.deleteMany({})
      .then(() =>
        res.json({
          success: true,
          delete: "All the questions are deleted successfully"
        })
      )
      .catch(err => console.log("Problem in deleting the questions " + err));
  }
);

module.exports = router;

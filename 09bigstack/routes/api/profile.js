const express = require("express");
const passport = require("passport");
const router = express.Router();

//Load Person Model
const Person = require("../../models/Person");

//Load Profile Model
const Profile = require("../../models/Profile");

//@type GET
//@route /api/profile
//@desc route for personal user profile
//@access PRIVATE
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          return res.json({ profileNotFound: "No Profile Found" });
        }
        return res.json({ profile });
      })
      .catch(err => console.log("Got some error in profile " + err));
  }
);

//@type POST
//@route /api/profile
//@desc route for Update/Save personal user profile
//@access PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),

  (req, res) => {
    const profileValues = {};
    profileValues.user = req.user.id;
    if (req.body.username) profileValues.username = req.body.username;
    if (req.body.website) profileValues.website = req.body.website;
    if (req.body.portfolio) profileValues.portfolio = req.body.portfolio;
    if (req.body.country) profileValues.country = req.body.country;
    if (typeof req.body.languages !== undefined)
      profileValues.languages = req.body.languages.split(",");

    //social info
    profileValues.social = {};
    if (req.body.youtube) profileValues.social.youtube = req.body.youtube;
    if (req.body.facebook) profileValues.social.facebook = req.body.facebook;
    if (req.body.instagram) profileValues.social.instagram = req.body.instagram;
    //Database
    //check any profile exist with for this user
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //profile exist
        if (profile) {
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileValues },
            { new: true }
          )
            .then(profile => {
              res.json({ profile });
            })
            .catch(err => console.log("Problem in update Profile " + err));
        }
        //no profile exist for this user
        else {
          Profile.findOne({ username: profileValues.username })
            .then(profile => {
              //username already exists
              if (profile) {
                res.status(400).json({ username: "Username already exists" });
              }
              //save user
              else {
                new Profile(profileValues)
                  .save()
                  .then(profile => res.json(profile))
                  .catch(err =>
                    console.log("Problem in saving new user " + err)
                  );
              }
            })
            .catch(err =>
              console.log("Problem in finding the profile with username " + err)
            );
        }
      })
      .catch(err => console.log("Problem in finding the Profile " + err));
  }
);

//@type GET
//@route /api/profile/:username
//@desc route to get user profile based on username
//@access PUBLIC
router.get("/:username", (req, res) => {
  Profile.findOne({ username: req.params.username })
    .populate("user", ["name", "profilePic"])
    .then(profile => {
      if (!profile) res.status(404).json({ userNotFound: "User not found" });
      else res.send(profile);
    })
    .catch(err =>
      console.log("Problem in fetching user profile based on username " + err)
    );
});

//@type GET
//@route /api/profile/:id
//@desc route to get user profile based on id
//@access PUBLIC
router.get("/:id", (req, res) => {
  console.log(req.params.id);
  Profile.findOne({ id: req.params.id })
    .populate("user", ["name", "profilePic"])
    .then(profile => {
      if (!profile)
        res
          .status(404)
          .json({ userNotFound: "No user profile found for this id" });
      else res.json({ profile });
    })
    .catch(err =>
      console.log("Problem in fetching user profile based on id " + err)
    );
});

//@type GET
//@route /api/profile/find/everyone
//@desc route to get all user profiles
//@access PUBLIC
router.get("/find/everyone", (req, res) => {
  Profile.find()
    .populate("user", ["name", "profilePic"])
    .then(profiles => {
      if (!profiles)
        res.status(404).json({ noProfilesFound: "No Profiles available" });
      else res.json(profiles);
    })
    .catch(err => console.log("Problem in fetching all profiles"));
});

//@type DELETE
//@route /api/profile
//@desc route to delete user
//@access PRIVATE
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id });
    Profile.findByIdAndRemove({ user: req.user.id })
      .then(() => {
        Person.findByIdAndRemove({ _id: req.user.id })
          .then(() => res.json({ success: "User deleted successfully" }))
          .catch(err => console.log("Problem in user deletion " + err));
      })
      .catch(err => console.log("No user found to delete " + err));
  }
);

//@type POST
//@route /api/profile/workrole
//@desc route to add workrole for a user profile
//@access PRIVATE
router.post(
  "/workrole",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          res.status(404).json({ profileNotFound: "User Profile not found" });
        } else {
          const newWork = {
            role: req.body.role,
            company: req.body.company,
            country: req.body.country,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            details: req.body.details
          };
          profile.workrole.unshift(newWork);
          profile
            .save()
            .then(profile => res.json(profile))
            .catch(err =>
              console.log("Problem in adding the work profile " + err)
            );
        }
      })
      .catch(err =>
        console.log(
          "Problem in fetching user profile to add work profile " + err
        )
      );
  }
);

//@type DELETE
//@route /api/profile/workrole/w_id
//@desc route to delete workrole in a user profile
//@access PRIVATE
router.delete(
  "/workrole/:w_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          res.status(404).json({
            profileNotFound: "Profile not found for work role deletion"
          });
        } else {
          const removeThis = profile.workrole
            .map(item => item.id)
            .indexOf(req.params.w_id);
          profile.workrole.splice(removeThis, 1);
          profile
            .save()
            .then(profile => res.json(profile))
            .catch(err => console.log(err));
        }
      })
      .catch(err =>
        console.log(
          "Problem in fetching user profile for work role deletion " + err
        )
      );
  }
);

module.exports = router;

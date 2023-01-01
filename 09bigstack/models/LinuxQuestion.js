const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const linuxSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "myPerson"
  },
  question: {
    type: String,
    require: true
  },
  code: {
    type: String
  },
  questionLikes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "myPerson"
      }
    }
  ],
  answers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "myPerson"
      },
      text: {
        type: String,
        require: true
      },
      answerLikes: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: "myPerson"
          }
        }
      ]
    }
  ]
});

module.exports = LinuxQuestion = mongoose.model("myLinuxQuestion", linuxSchema);

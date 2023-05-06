const { Schema, model } = require('mongoose');

// Create a new Schema for quiz
const questionSchema = new Schema({
    id: {
      type: String,
      required: true
    },
    question: {
      type: String,
      required: [true, 'Question must not be empty!'],
      trim: true,
    },
    answers: {
      type: [ String ],
      validate: {
        validator: function(v) {
          return v.length > 3;
        },
        message: () => `Must be 4 answers at least for the question!`
      },
      trim: true
    },
    correct: {
      type: Number,
      default: 0,
      enum: {
        values: [0, 1, 2, 3],
        message: 'The correct answer must be between 0-3, {VALUE} is not valid!'
      },
      required: true,
      trim: true
    }
})

const Question = model("Question", questionSchema);

module.exports = Question;
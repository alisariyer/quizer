const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");
const questions = require('./questions');

// Establish MongoDB Connection
const main = async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/quiz");
};

main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

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

const Quiz = model('Quiz', questionSchema);

async function cleanup() {
    const res = await Quiz.deleteMany({});
    console.log(res);
    const res2 = await Quiz.insertMany(questions)
    console.log(res2);
}

cleanup()

process.on('SIGINT', async function() {
    await mongoose.connection.close()
    process.exit(0);
})
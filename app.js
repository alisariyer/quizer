const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");
const morgan = require("morgan");
const fs = require("fs");
const questions = require("./questions");
const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

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

// setup view engine
app.set("view engine", "ejs");
app.set("ejs", path.join(__dirname, "views"));

// use middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setup morgan logger
const accessLogStream = fs.WriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
app.use(morgan("tiny", { stream: accessLogStream }));

// GET home route
app.get("/", (req, res) => {
  res.render("home");
});

// GET questions to guest
app.get("/questions", async (req, res) => {
  const quiz = await Quiz.find({})
  console.log(quiz);
  res.render("questions", { questions: quiz });
});

// POST questions answers
app.post("/questions", (req, res) => {
  const answers = req.body;
  questions.forEach((question) => {
    answers.forEach((answer) => {
      if (question.id === answer.id) {
        const { correct } = question;
        answer.correct = correct;
      }
    });
  });
  res.send({ message: "Success", answers });
});

// GET new question
app.get("/questions/new", (req, res) => {
  res.render("new");
});

// POST new question
app.post("/questions/new", (req, res) => {
  const { question, answers, correct } = req.body;
  questions.push({
    id: uuidv4(),
    question,
    answers,
    correct: parseInt(correct),
  });
  res.redirect("/questions/list");
});

// GET questions for admin
app.get("/questions/list", (req, res) => {
  res.render("questions-list", { questions });
});

// GET a specific question
app.get("/questions/question/:id", (req, res) => {
  const { id } = req.params;
  if (id) {
    const question = questions.find((question) => question.id === id);
    return res.render("edit", { question });
  }
  res.status(400).send("Unknown Id, please check it: " + id);
});

// UPDATE a specific question
app.put("/questions/question/:id", (req, res) => {
  const { id } = req.params;
  const { question, answers, correct } = req.body;
  if (id) {
    const index = questions.findIndex((question) => question.id === id);
    if (id > -1) {
      questions[index] = {
        id,
        question,
        answers,
        correct,
      };
    }
    return res.send({ message: "Updated" });
  }
  res.status(400).send({ message: "Errrorrr..." });
});

// DELETE a specific question
app.delete("/questions/question/:id", (req, res) => {
  const { id } = req.params;
  const index = questions.findIndex((el) => el.id === id);
  if (index > -1) questions.splice(index, 1);
  res.redirect("/questions/list");
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).send(message);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

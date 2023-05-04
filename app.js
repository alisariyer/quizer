const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");
const morgan = require("morgan");
const fs = require("fs");
const mongoose = require("mongoose");
const { model } = require("mongoose");
const questionSchema = require("./model/quiz")

// Establish MongoDB Connection
const main = async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/quiz");
};

main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

const Question = model('Question', questionSchema);

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

// GET questions (send all questions to client side from DB)
app.get("/questions", async (req, res) => {
  const questions = await Question.find({})
  res.render("questions", { questions });
});

// POST answers (and send back with correct answers to client side)
app.post("/questions", async (req, res) => {
  const questions = await Question.find({});
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

// POST new question (and save in DB)
app.post("/questions/new", async (req, res) => {
  const { question, answers, correct } = req.body;
  const newQuestion = new Question({
    id: uuidv4(),
    question,
    answers,
    correct: parseInt(correct),
  });
  await newQuestion.save();
  res.redirect("/questions/list");
});

// GET questions (send all questions to show as a list)
app.get("/questions/list", async (req, res) => {
  const questions = await Question.find({});
  res.render("questions-list", { questions });
});

// GET a specific question
app.get("/questions/question/:id", async (req, res) => {
  const { id } = req.params;
  if (id) {
    const question = await Question.findOne({ id });
    return res.render("edit", { question });
  }
  res.status(400).send("Unknown Id, please check it: " + id);
});

// UPDATE a specific question
app.put("/questions/question/:id", async (req, res) => {
  const { id } = req.params;
  const { question, answers, correct } = req.body;
  if (id) {
    await Question.updateOne({ id }, { $set: { question, answers, correct: parseInt(correct) }}, { runValidators: true, new: true});
    return res.send({ message: "Updated" });
  }
  res.status(400).send({ message: "Errrorrr..." });
});

// DELETE a specific question
app.delete("/questions/question/:id", async (req, res) => {
  const { id } = req.params;
  if (id) {
    await Question.deleteOne({ id })
  }
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

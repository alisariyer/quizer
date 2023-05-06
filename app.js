const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");
const morgan = require("morgan");
const fs = require("fs");
const mongoose = require("mongoose");
const { model } = require("mongoose");
const Question = require("./db/models/question");
const AppError = require("./AppError");
require("dotenv").config();

// Establish MongoDB Connection
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;
const main = async () => {
  await mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`);
};

main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

// setup view engine
app.set("view engine", "ejs");
app.set("ejs", path.join(__dirname, "views"));

// use middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setup morgan logger
// const accessLogStream = fs.WriteStream(path.join(__dirname, "access.log"), {
//   flags: "a",
// });
// app.use(morgan("tiny", { stream: accessLogStream }));
app.use(morgan("tiny"));

let isLoggedIn = false;

const login = (req, res, next) => {
  if (isLoggedIn) return next();
  // 303: Redirect for undefined reason
  return res.redirect(303, "/login");
};

// GET home route
app.get("/", (req, res) => {
  res.render("home");
});

// app.get("/error", (req, res) => {
//   throw new Error('heyyyyy erorrrsfjsldjfalsdjf')
//   res.send('heello');
// })

app.get("/signup", (req, res) => {
  res.render("signup");
})

app.post("/signup", (req, res) => {
  const { email, password, passwordConfirm } = req.body;
  console.log(req.body);
  return res.send('Success');
})

app.get("/login", (req, res) => {
  res.render("login");
});

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASS;

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email === EMAIL && password === PASSWORD) {
    isLoggedIn = true;
    return res.redirect(302, "/");
  }
  // 401 Unauthorized
  res.status(401).send("Wrong credentials!!!");
});

app.get("/logout", login, (req, res) => {
  isLoggedIn = false;
  res.redirect("/");
});

// GET questions (send all questions to client side from DB)
app.get("/quiz", login, async (req, res, next) => {
  let questions;
  try {
    questions = await Question.find({});
  } catch (err) {
    return next(err);
  }
  res.render("quiz", { questions });
});

// POST answers (and send back with correct answers to client side)
app.post("/quiz", login, async (req, res, next) => {
  let questions;
  const { answers } = req.body;
  try {
    if (answers) {
      questions = await Question.find({});
      questions.forEach((question) => {
        answers.forEach((answer) => {
          if (question.id === answer.id) {
            const { correct } = question;
            answer.correct = correct;
          }
        });
      });
    } else {
      throw new AppError('Missing answers...', 401);
    }
  } catch (err) {
    return next(err);
  }
  res.send({ message: "Success", answers });
});

// GET new question
app.get("/questions/new", login, (req, res) => {
  res.render("new");
});

// POST new question (and save in DB)
app.post("/questions/new", login, async (req, res, next) => {
  const { question, answers, correct } = req.body;
  try {
    const newQuestion = new Question({
      id: uuidv4(),
      question,
      answers,
      correct: parseInt(correct),
    });
    await newQuestion.save();
  } catch (err) {
    return next(err);
  }
  res.redirect("/questions");
});

// GET questions (send all questions to show as a list)
app.get("/questions", login, async (req, res, next) => {
  let questions;
  try {
    questions = await Question.find({});
  } catch (err) {
    return next(err);
  }
  res.render("questions", { questions });
});

// GET a specific question
app.get("/questions/:id", login, async (req, res, next) => {
  const { id } = req.params;
  let question;
  try {
    if (id) {
      question = await Question.findOne({ id });
    } else {
      throw new AppError("Missing Id...", 401);
    }
  } catch (err) {
    return next(err);
  }
  res.render("edit", { question });
});

// UPDATE a specific question
app.put("/questions/:id", login, async (req, res, next) => {
  const { id } = req.params;
  const { question, answers, correct } = req.body;
  try {
    if (id) {
      await Question.updateOne(
        { id },
        { $set: { question, answers, correct: parseInt(correct) } },
        { runValidators: true, new: true }
      );
    } else {
      throw new AppError("Unauthorized", 401);
    }
  } catch (err) {
    return next(err);
  }
  return res.send({ message: "Updated" });
});

// DELETE a specific question
app.delete("/questions/:id", login, async (req, res, next) => {
  const { id } = req.params;
  try {
    if (id) {
      await Question.deleteOne({ id });
    } else {
      throw new AppError("Missing Id...", 400);
    }
  } catch (err) {
    return next(err);
  }
  res.redirect("/questions");
});

app.all("*", login);

app.use((err, req, res, next) => {
  console.log("error 404.....");
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).send(message);
  // next(err);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

process.on("SIGINT", () => {
  try {
    mongoose.connection.close();
    console.log("Mongoose connection disconnected");
  } catch (err) {
    console.log("Mongoose disconnection error: ", err.message);
  } finally {
    process.exit(0);
  }
});

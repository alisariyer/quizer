const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {
  userValidationSchema,
  answersValidationSchema,
  questionValidationSchema,
} = require("./utils/validationSchemas");
const Question = require("./db/models/question");
const User = require("./db/models/user");
const Score = require("./db/models/score");
const ExpressError = require("./utils/ExpressError");
const { catchAsync } = require("./utils/catchAsync");
require("dotenv").config();
// for bcrypt hashing
const saltRounds = 10;
// login flags and details
let isLoggedIn = false;
let currentUserEmail;
let quizDuration = 0;
let quizDurationInterval;

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

// temp login checking middleware
const login = (req, res, next) => {
  if (isLoggedIn) return next();
  // 303: Redirect for undefined reason
  return res.redirect(303, "/login");
};

// GET home route
app.get("/", (req, res) => {
  quizDuration = 0;
  quizDurationInterval = 0;
  res.render("home", { isLoggedIn });
});

// GET signup
app.get("/signup", (req, res) => {
  if (isLoggedIn) return res.redirect(302, "/");
  res.render("signup", { isLoggedIn });
});

// POST signup
app.post(
  "/signup",
  catchAsync(async (req, res, next) => {
    const { email, password, passwordRepeat } = req.body;

    const { error } = userValidationSchema.validate({
      email,
      password,
      passwordRepeat,
    });
    if (error) {
      const messages = error.details.map((detail) => detail.message).join(", ");
      throw new ExpressError(messages, 400);
    }

    // if email is already registered, reject it
    const foundUser = await User.findOne({ email });
    if (foundUser)
      return res.send({
        success: false,
        message: "Incorrect email address!",
      });

    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = {
      email,
      password: hash,
      scores: [],
    };
    const user = await User.create(newUser);
    if (user) {
      return res.send({
        success: true,
        message: "Your account has been created, please log in now.",
      });
    } else {
      throw new ExpressError("Internal server error", 500);
    }
  })
);

// GET login
app.get("/login", (req, res) => {
  if (isLoggedIn) return res.redirect(303, "/");
  res.render("login", { isLoggedIn });
});

// POST login
app.post(
  "/login",
  catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Username or password can not be empty!",
      });
    }

    const foundUser = await User.findByEmail(email);
    if (!foundUser) {
      return res.status(400).send({
        success: false,
        message: "Incorrect email or password!",
      });
    }

    const confirmPassword = await bcrypt.compare(password, foundUser.password);
    if (!confirmPassword) {
      return res.status(400).send({
        success: false,
        message: "Incorrect username or password!",
      });
    }

    currentUserEmail = email;
    isLoggedIn = true;
    return res.redirect(302, "/");
  })
);

// GET logout
app.get("/logout", login, (req, res) => {
  isLoggedIn = false;
  res.redirect("/");
});

// Calculate quiz duration
const startQuizDuration = () => {
  quizDuration = 0;
  quizDurationInterval = setInterval(() => {
    quizDuration++;
  }, 1000);
};

// GET questions (send all questions to client side from DB)
app.get(
  "/quiz",
  login,
  catchAsync(async (req, res, next) => {
    // if the page is requested, start the quiz duration
    // As the quiz starts just after load of the quiz page
    // So we calculate duration on backend
    startQuizDuration();
    let questions;
    questions = await Question.find({});
    res.render("quiz", { questions, isLoggedIn });
  })
);

// POST answers (and send back with correct answers to client side)
app.post(
  "/quiz",
  login,
  catchAsync(async (req, res, next) => {
    let questions;
    const { answers } = req.body;
    const { error } = answersValidationSchema.validate({ answers });
    if (error) {
      const message = error.details.map((detail) => detail.message).join(", ");
      return res.send({ success: false, message });
    }

    let corrects = 0;

    questions = await Question.find({});
    questions.forEach((question) => {
      answers.forEach((answer) => {
        if (question.id === answer.id) {
          if (question.correct + "" === answer.answer) corrects++;
          const { correct } = question;
          answer.correct = correct;
        }
      });
    });

    console.log("Total duration: ", quizDuration);
    clearInterval(quizDurationInterval);
    const currentScore = ((corrects / questions.length) * 10).toFixed(2);

    const user = await User.findByEmail(currentUserEmail);
    const score = new Score({ score: currentScore, seconds: quizDuration });
    user.scores.push(score);
    await score.save();
    await user.save();
    quizDuration = 0;

    res.send({ success: true, answers, message: "Confirmed" });
  })
);

// GET new question
app.get("/questions/new", login, (req, res) => {
  res.render("new", { isLoggedIn });
});

// POST new question (and save in DB)
app.post(
  "/questions/new",
  login,
  catchAsync(async (req, res, next) => {
    const { question, answers, correct } = req.body;
    const { error } = questionValidationSchema.validate({
      question,
      answers,
      correct,
    });
    if (error) {
      const message = error.details.map((detail) => detail.message).join(", ");
      return res.status(400).send({ success: false, message });
    }
    const newQuestion = new Question({
      id: uuidv4(),
      question,
      answers,
      correct: parseInt(correct),
    });
    await newQuestion.save();
    res.redirect("/questions");
  })
);

// GET questions (send all questions to show as a list)
app.get(
  "/questions",
  login,
  catchAsync(async (req, res, next) => {
    let questions;
    questions = await Question.find({});
    res.render("questions", { questions, isLoggedIn });
  })
);

// GET a specific question
app.get(
  "/questions/:id",
  login,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const question = await Question.findOne({ id });
    res.render("edit", { question, isLoggedIn });
  })
);

// UPDATE a specific question
app.put(
  "/questions/:id",
  login,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { question, answers, correct } = req.body;

    const { error } = questionValidationSchema.validate({
      question,
      answers,
      correct,
    });
    if (error) {
      const message = error.details.map((detail) => detail.message).join(", ");
      res.status(400).send({ success: false, message });
    }

    await Question.updateOne(
      { id },
      { $set: { question, answers, correct: parseInt(correct) } },
      { runValidators: true, new: true }
    );
    return res.send({ success: true, message: "Updated" });
  })
);

// DELETE a specific question
app.delete(
  "/questions/:id",
  login,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Question.deleteOne({ id });
    res.redirect("/questions");
  })
);

// GET score table
app.get(
  "/scores",
  login,
  catchAsync(async (req, res, next) => {
    const scores = await User.getScores(currentUserEmail);
    res.render('scores', { scores, isLoggedIn });
  })
);

// app.all("*", login);
app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found!", 404));
});

// Generic error middleware
app.use((err, req, res, next) => {
  console.log("error 404.....");
  // Mongoose errors: ValidationError, CastError,
  // if (err.name === 'ValidationError') err = handleValidationErr(err);
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).send(message);
  // next(err);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Close db when exiting
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

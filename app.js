const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require('express-session');
const ExpressError = require("./utils/ExpressError");
require("dotenv").config();
const indexRouter = require('./routes/index');

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

const sessionConfig = {
  secret: process.env.ACCESS_TOKEN_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig));

// setup morgan logger
// const accessLogStream = fs.WriteStream(path.join(__dirname, "access.log"), {
//   flags: "a",
// });
// app.use(morgan("tiny", { stream: accessLogStream }));
app.use(morgan("tiny"));

app.use('/', indexRouter);

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

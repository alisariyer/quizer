const mongoose = require("mongoose");
const Question = require('../models/question');
const questions = require("./questions");
require('dotenv').config();

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

async function seedDB() {
  await Question.deleteMany({});
  await Question.insertMany(questions);
  mongoose.connection.close();
  console.log('Seed DB process is completed.');
  process.exit(0);
}

seedDB();

const Question = require("../db/models/question");
const { v4: uuidv4 } = require("uuid");
const { questionValidationSchema } = require("../utils/validationSchemas");

const QuestionsController = {
  // GET new question
  getNew: (req, res) => {
    const isLoggedIn = !!req.session.user_id;
    res.render("new", { isLoggedIn });
  },

  // POST new question (and save in DB)
  postNew: async (req, res, next) => {
    const { question, answers, correct } = req.body;
    const { error } = questionValidationSchema.validate({
      question,
      answers,
      correct,
    });

    if (error) {
      const message = error.details.map((detail) => detail.message).join(", ");
      req.flash("error", message);
      return res.redirect(302, "/questions/new");
      // return res.status(400).send({ success: false, message });
    }

    const newQuestion = new Question({
      id: uuidv4(),
      question,
      answers,
      correct: parseInt(correct),
    });

    try {
      await newQuestion.save();
    } catch (err) {
      req.flash("error", err);
      return res.redirect(302, "/questions/new");
      // return next(err);
    }
    res.redirect(302, "/questions");
  },

  // GET questions (send all questions to show as a list)
  getIndex: async (req, res, next) => {
    let questions;

    try {
      questions = await Question.find({});
    } catch (err) {
      req.flash("error", err);
      return res.redirect(302, "/");
      // return next(err);
    }
    const isLoggedIn = !!req.session.user_id;
    res.render("questions", { questions, isLoggedIn });
  },

  // GET a specific question
  getOne: async (req, res, next) => {
    const { id } = req.params;

    let question;
    try {
      question = await Question.findOne({ id });
    } catch (err) {
      req.flash("error", err);
      return res.redirect(302, "/questions");
      // return next(err);
    }

    const isLoggedIn = !!req.session.user_id;
    res.render("edit", { question, isLoggedIn });
  },

  // UPDATE a specific question
  updateOne: async (req, res, next) => {
    const { id } = req.params;
    const { question, answers, correct } = req.body;

    const { error } = questionValidationSchema.validate({
      question,
      answers,
      correct: String(correct),
    });
    if (error) {
      const message = error.details.map((detail) => detail.message).join(", ");
      req.flash("error", message);
      return res.redirect(302, `/questions/${id}`);
      // return res.status(400).send({ success: false, message });
    }

    try {
      await Question.updateOne(
        { id },
        { $set: { question, answers, correct: parseInt(correct) } },
        { runValidators: true, new: true }
      );
    } catch (err) {
      req.flash("error", err);
      return res.redirect(302, `/questions/${id}`);
      // return next(err);
    }

    // return res.send({ success: true, message: "Updated" });
    req.flash("success", "Successfully updated!");
    res.redirect(302, `/questions/${id}`);
  },

  // DELETE a specific question
  deleteOne: async (req, res, next) => {
    const { id } = req.params;

    try {
      await Question.deleteOne({ id });
    } catch (err) {
      // return next(err);
      req.flash("error", err);
      return res.redirect(302, `/questions/${id}`);
    }

    req.flash("success", "Successfully deleted!");
    res.redirect(302, "/questions");
  },
};

module.exports = QuestionsController;

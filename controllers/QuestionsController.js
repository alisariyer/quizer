const Question = require("../db/models/question");
const { v4: uuidv4 } = require("uuid");
const { questionValidationSchema } = require("../utils/validationSchemas");

const QuestionsController = {
  // GET new question
  getNew: (req, res) => {
    res.render("new");
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
    }

    req.flash("success", "New question has been successfully added!");
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
    }

    res.render("questions", { questions });
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
    }

    res.render("edit", { question });
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
      return res.send({
        success: false,
        message
      })
    }

    try {
      await Question.updateOne(
        { id },
        { $set: { question, answers, correct: parseInt(correct) } },
        { runValidators: true, new: true }
      );
    } catch (err) {
      return res.send({
        success: false,
        message: err
      })
    }

    return res.send({
      success: true,
      message: 'Successfully updated!'
    })
  },

  // DELETE a specific question
  deleteOne: async (req, res, next) => {
    const { id } = req.params;

    try {
      await Question.deleteOne({ id });
    } catch (err) {
      req.flash("error", err);
      return res.redirect(302, `/questions`);
    }

    req.flash("success", "Successfully deleted!");
    res.redirect(302, "/questions");
  },
};

module.exports = QuestionsController;

const Question = require("../db/models/question");
const User = require("../db/models/user");
const Score = require("../db/models/score");
const { answersValidationSchema } = require("../utils/validationSchemas");

let quizDuration = 0;
let quizDurationInterval;

// Calculate quiz duration
const startQuizDuration = () => {
  quizDuration = 0;
  quizDurationInterval = setInterval(() => {
    quizDuration++;
  }, 1000);
};

const QuizController = {
  // GET questions (send all questions to client side from DB)
  getQuiz: async (req, res, next) => {
    // if the page is requested, start the quiz duration
    // As the quiz starts just after load of the quiz page
    // So we calculate duration on backend
    startQuizDuration();
    let questions;
    try {
      questions = await Question.find({});
    } catch (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    res.render("quiz", { questions });
  },

  // POST answers (and send back with correct answers to client side)
  postQuiz: async (req, res, next) => {
    const { answers } = req.body;
    const { error } = answersValidationSchema.validate({ answers });
    if (error) {
      const message = error.details.map((detail) => detail.message).join(", ");
      req.flash('error', message);
      return res.redirect(302, '/quiz');
    }

    let corrects = 0;
    let questions;
    try {
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
    } catch (err) {
      req.flash('error', err);
      return res.redirect(302, '/quiz');
    }
    
    clearInterval(quizDurationInterval);
    const currentScore = ((corrects / questions.length) * 10).toFixed(2);

    let user;
    try {
      user = await User.findById(req.session.user_id);
      const score = new Score({ score: currentScore, seconds: quizDuration });
      user.scores.push(score);
      await score.save();
      await user.save();
    } catch (err) {
      req.flash('error', err);
      return res.redirect(302, '/quiz');
    }
    
    quizDuration = 0;

    res.send({ success: true, answers, message: "Confirmed" });
  },
};

module.exports = QuizController;

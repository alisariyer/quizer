const express = require("express");
const router = express.Router();
const QuestionsController = require("../controllers/QuestionsController");
const authenticateUser = require("./authenticateUser");
const AuthController = require("../controllers/AuthController");
const QuizController = require("../controllers/QuizController");
const ScoresController = require("../controllers/ScoresController");

// GET home route
router.get("/", (req, res) => {
  res.render("home");
});

router.get("/login", AuthController.getLogin);
router.post("/login", AuthController.postLogin);
router.get("/signup", AuthController.getSignUp);
router.post("/signup", AuthController.postSignUp);
router.get("/logout", authenticateUser, AuthController.logout);

router.get("/quiz", authenticateUser, QuizController.getQuiz);
router.post("/quiz", authenticateUser, QuizController.postQuiz);

router.get("/questions/new", authenticateUser, QuestionsController.getNew);
router.post("/questions/new", authenticateUser, QuestionsController.postNew);
router.get("/questions", authenticateUser, QuestionsController.getIndex);
router.get("/questions/:id", authenticateUser, QuestionsController.getOne);
router.put("/questions/:id", authenticateUser, QuestionsController.updateOne);
router.delete(
  "/questions/:id",
  authenticateUser,
  QuestionsController.deleteOne
);

router.get("/scores", authenticateUser, ScoresController.getScores);

module.exports = router;

const User = require("../db/models/user");

const ScoresController = {
  getScores: async (req, res, next) => {
    let scores;
    try {
      scores = await User.getScores(req.session.user_id);
    } catch (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    const isLoggedIn = !!req.session.user_id;
    res.render("scores", { scores, isLoggedIn });
  },
};

module.exports = ScoresController;

const User = require("../db/models/user");
const { userValidationSchema } = require("../utils/validationSchemas");
const bcrypt = require("bcrypt");

const AuthController = {
  getSignUp: (req, res) => {
    const isLoggedIn = !!req.session.user_id;
    res.render("signup", { isLoggedIn });
  },

  postSignUp: async (req, res, next) => {
    const { email, password, passwordRepeat } = req.body;

    const { error } = userValidationSchema.validate({
      email,
      password,
      passwordRepeat,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(", ");
      req.flash("error", messages);
      return res.redirect(302, "/signup");
    }

    // if email is already registered, reject it
    let foundUser;
    try {
      foundUser = await User.findByEmail(email);
    } catch (err) {
      req.flash("error", err);
      return res.redirect(302, "/signup");
    }

    if (foundUser) {
      req.flash("error", "Incorrect email address!");
      return res.redirect(302, "/signup");
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = {
      email,
      password: hash,
      scores: [],
    };

    let user;
    try {
      user = await User.create(newUser);
    } catch (err) {
      req.flash("error", err);
      return res.redirect(302, "/signup");
    }

    if (user) {
      req.flash("success", "Your account has been created, please login");
      return res.redirect(302, "/login");
    } else {
      req.flash("error", "Unknown error, please try later again!");
      return res.redirect(302, "/signup");
    }
  },

  getLogin: (req, res) => {
    const isLoggedIn = !!req.session.user_id;
    res.render("login", { isLoggedIn });
  },

  postLogin: async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      req.flash("error", "Username or password can not be empty!");
      return res.redirect(302, "/login");
    }

    let foundUser;
    try {
      foundUser = await User.findByEmail(email);
    } catch (err) {
      req.flash("error", err);
      return res.redirect(302, "/login");
    }

    if (!foundUser) {
      req.flash("error", "Incorrect email or password!");
      return res.redirect(302, "/login");
    }

    const confirmPassword = await bcrypt.compare(password, foundUser.password);
    if (!confirmPassword) {
      req.flash("error", "Incorrect email or password!")
      return res.redirect(302, '/login');
    }
    req.session.user_id = foundUser._id;
    res.redirect(302, "/");
  },

  logout: (req, res) => {
    req.session.destroy();
    res.redirect("/");
  },
};

module.exports = AuthController;

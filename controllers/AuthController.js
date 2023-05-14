const User = require("../db/models/user");
const { userValidationSchema } = require("../utils/validationSchemas");
const ExpressError = require("../utils/ExpressError");
const bcrypt = require("bcrypt");
// for bcrypt hashing
const saltRounds = 10;

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
      throw new ExpressError(messages, 400);
    }

    // if email is already registered, reject it
    let foundUser;
    try {
      foundUser = await User.findByEmail(email);
    } catch (err) {
      return next(err);
    }

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

    let user;
    try {
      user = await User.create(newUser);
    } catch (err) {
      return next(err);
    }

    if (user) {
      return res.send({
        success: true,
        message: "Your account has been created, please log in now.",
      });
    } else {
      throw new ExpressError("Internal server error", 500);
    }
  },

  getLogin: (req, res) => {
    const isLoggedIn = !!req.session.user_id;
    res.render("login", { isLoggedIn });
  },

  postLogin: async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Username or password can not be empty!",
      });
    }

    let foundUser;
    try {
      foundUser = await User.findByEmail(email);
    } catch (err) {
      return next(err);
    }

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
    req.session.user_id = foundUser._id;
    res.redirect(302, '/');
  },

  logout: (req, res) => {
    req.session.destroy();
    res.redirect("/");
  },
};

module.exports = AuthController;

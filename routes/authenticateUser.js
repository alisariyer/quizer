const authenticateUser = (req, res, next) => {
  if (req.session.user_id) {
    return next();
  }
  res.redirect(302, '/login');
}

module.exports = authenticateUser;

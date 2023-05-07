// helper function to catch async errors in routes
module.exports = {
  catchAsync: (func) => {
    return (req, res, next) => {
      func(req, res, next).catch((err) => next(err));
    };
  },
};

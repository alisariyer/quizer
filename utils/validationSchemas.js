const Joi = require("joi");

module.exports = {
  userValidationSchema: Joi.object({
    username: Joi.string().min(6).trim().required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: {
          allow: ["com", "net"],
        },
      })
      .trim()
      .required(),

    password: Joi.string()
      .min(8)
      .max(30)
      .pattern(new RegExp("^[a-zA-Z0-9&*@#_|-]{8,30}$"))
      .required(),

    passwordRepeat: Joi.ref("password"),
  }),

  answersValidationSchema: Joi.object({
    answers: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().required(),
          answer: Joi.string().pattern(new RegExp("^([0-3]|-1)$")).required(),
        })
      )
      .min(1)
      .required(),
  }),
  questionValidationSchema: Joi.object({
    question: Joi.string().min(1).max(500).required(),
    answers: Joi.array()
      .items(Joi.string().min(1).max(100).required())
      .length(4)
      .required(),
    correct: Joi.string().pattern(new RegExp("^[0-3]$")).required(),
  }),
};

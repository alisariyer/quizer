const Joi = require("joi");

module.exports = {
    userValidationSchema: Joi.object({
        email: Joi.string()
          .email({
            minDomainSegments: 2,
            tlds: {
              allow: ["com", "net"],
            },
          })
          .required(),
  
        password: Joi.string()
          .min(8)
          .max(30)
          .pattern(new RegExp("^[a-zA-Z0-9&*@#_|-]{8,30}$"))
          .required(),
  
        passwordRepeat: Joi.ref("password"),
      }),
};
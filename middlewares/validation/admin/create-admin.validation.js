const validator = require("validator");
const __ = require("lodash");
const Joi = require("joi");
const { Admin } = require("../../../models/admin.model");

module.exports.validateCreateAdmin = async (req, res, next) => {
  const { email, password, confirmPassword, fullName } = req.body;

  const authSchema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required()
      .label("Email"),
    // .messages({
    //   "email.any": "Email invalid",
    //   "string.base": "Email invalid",
    //   "string.empty": "Email invalid",
    //   "string.min": "Email invalid",
    //   "string.max": "Email invalid",
    //   "any.required": "Email invalid",
    //   "string.email": "Email invalid"
    // })
    password: Joi.string()
      .min(6)
      .max(30)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .label("Password")
      .required(),
    // .messages({
    //   "string.base": "Password invalid",
    //   "string.empty": "Password invalid",
    //   "string.min": "Password invalid",
    //   "string.max": "Password invalid",
    //   "any.required": "Password invalid"
    // })
    confirmPassword: Joi.string()
      .label("confirmPassword")
      .valid(Joi.ref("password")),
    // .messages({
    //   "any.only": "ConfirmPassword invalid"
    // })
    fullName: Joi.string()
      .trim()
      .alphanum()
      .min(3)
      .max(30)
      .regex(/^[a-zA-Z]+$/)
      .label("Fullname")
      .required(),
    // .messages({
    //   "string.base": "Fullname invalid",
    //   "string.empty": "Fullname invalid",
    //   "string.min": "Fullname invalid",
    //   "string.max": "Fullname invalid",
    //   "any.required": "Fullname invalid",
    //   "string.pattern.base": "Fullname invalid"
    // })
  }).with("password", "confirmPassword");

  try {
    const admin = await Admin.findOne({ email });
    const result = authSchema.validate(req.body, { abortEarly: false });
    let arrError = [];
    if (admin) {
      arrError.push("Email exist");
    }
    if (result.error) {
      result.error.details.map((x) => {
        arrError.push(x.message);
      });
    }
    if (Object.keys(arrError).length > 0) {
      throw { error: arrError };
    } else {
      return next();
    }
  } catch (error) {
    return res.json(error);
  }
};

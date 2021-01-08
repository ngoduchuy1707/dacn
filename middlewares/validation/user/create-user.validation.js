const validator = require("validator");
const __ = require("lodash");
const Joi = require("joi");

const { User } = require("../../../models/user.model");
const errResult = require("../../../config/errors/errorResult");

module.exports.validateCreateUser = async (req, res, next) => {
  const { email, password, confirmPassword, fullName } = req.body;

  const authSchema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: {
          allow: ["com", "net"],
        },
      })
      .required()
      .label("Email"),
    // .messages({
    //   "email.any": "Email invalid",
    //   "string.base": "Email invalid",
    //   "string.empty": "Email invalid",
    //   "string.min": "Email invalid",
    //   "string.max": "Email invalid",
    //   "any.required": "Email invalid",
    //   "string.email": "Email invalid",
    // })
    password: Joi.string()
     // .min(6)
     // .max(30)
      //.pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .label("Password")
      .required(),
    // .messages({
    //   "string.base": "Password invalid",
    //   "string.empty": "Password invalid",
    //   "string.min": "Password invalid",
    //   "string.max": "Password invalid",
    //   "any.required": "Password invalid",
    // })
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .label("ConfirmPassword"),
    // .messages({
    //   "any.only": "ConfirmPassword invalid",
    // })
    fullName: Joi.string()
      //.trim()
     // .alphanum()
      //.min(3)
      //.max(30)
      //.regex(/^[a-zA-Z]+$/)
      .label("Fullname")
      .required(),
    // .messages({
    //   "string.base": "Fullname invalid",
    //   "string.empty": "Fullname invalid",
    //   "string.min": "Fullname invalid",
    //   "string.max": "Fullname invalid",
    //   "any.required": "Fullname invalid",
    //   "string.pattern.base": "Fullname invalid",
    // })
    phone: Joi.string()
      .label("Phone")
      //.pattern(new RegExp("^[0][0-9]{8,9}$"))
      .required(),
    // .messages({
    //   "any.required": "Phone invalid",
    //   "string.empty": "Phone invalid",
    //   "string.pattern.base": "Phone invalid",
    // })
    dateOfBirth: Joi.string()
      .label("Date Of Birth")
      //.pattern(new RegExp("^[0-9]{1,2}[-|/][0-9]{1,2}[-|/][0-9999]{4}$"))
      .required(),
    // .messages({
    //   "any.required": "DateOfBirth invalid",
    //   "string.empty": "DateOfBirth invalid",
    // })
    address: Joi.string().label("Address").required(),
    // .messages({
    //   "any.required": "Address invalid",
    //   "string.empty": "Address invalid",
    // })
    gender: Joi.string()
      .label("Gender")
      .required()
      .valid("male", "female", "ohter"),
  }).with("password", "confirmPassword");

  try {
    const user = await User.findOne({ email });
    const result = authSchema.validate(req.body, { abortEarly: false });
    let arrError = [];
    if (user) {
      arrError.push("Email exist");
    }
    if (result.error) {
      result.error.details.map((x) => {
        arrError.push(x.message);
      });
    }
    if (Object.keys(arrError).length > 0) {
      throw {
        error: arrError,
      };
    } else {
      return next();
    }

    // let types = Object.keys(req.body); //chuyen sang mang
    // let errors = {},
    //   messages = {};
    // types.forEach((type) => { //duyet
    //   let result = Joi.validate(req.body[type], { abortEarly: false }); 
    //   if (result.error) {
    //     result.error.details.forEach((err) => {
    //       errors[err.path[0]] = errorCode[err.type];
    //       messages[err.path[0]] = err && err.message && err.message;
    //     });
    //   }
    //   req.body[type] = result.value;
    // });
    // console.log(errors);
  } catch (error) {
    return res.json(error);
  }
};

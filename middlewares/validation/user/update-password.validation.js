const validator = require("validator");
const Joi = require("joi");
const errResult = require("../../../config/errors/errorResult");
const { User } = require("../../../models/user.model");

module.exports.validateUpdatePassword = async (req, res, next) => {
  const { email, oldPassword, newPassword, confirmNewPassword } = req.body;
  const schema = Joi.object({
    email: Joi.string().label("Email").required(),
    newPassword: Joi.string()
      //.min(6)
      //.max(30)
      // .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .label("NewPassword")
      .required(),
    // .messages({
    //     "string.base": "Password invalid",
    //     "string.empty": "Password invalid",
    //     "string.min": "Password invalid",
    //     "string.max": "Password invalid",
    //     "any.required": "Password invalid"
    // })
    oldPassword: Joi.string().label("OldPassword").required(),
    // .messages({
    //     "string.base": "Password invalid",
    //     "string.empty": "Password invalid",
    //     "string.min": "Password invalid",
    //     "string.max": "Password invalid",
    //     "any.required": "Password invalid"
    // })
    confirmNewPassword: Joi.string()
      .label("ConfirmPassword")
      .valid(Joi.ref("newPassword")),
  }).with("newPassword", "confirmNewPassword");

  try {
    const user = await User.findOne({ email });
    const result = authSchema.validate(req.body, { abortEarly: false });
    let arrError = [];
    if (!user) {
      throw { message: errResult.notFound };
    }
    if (result.error) {
      throw result.error.details.map((x) => {
        arrError.push(x.message);
      });
    }
    if (Object.keys(arrError).length > 0) {
      throw {
        error: arrError,
      };
    } else {
      next();
    }
  } catch (error) {
    return res.json({ error });
  }
};

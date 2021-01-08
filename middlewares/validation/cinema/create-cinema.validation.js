const validator = require("validator");
const __ = require("lodash");
const Joi = require("joi");
const errResult = require("../../../config/errors/errorResult");
const { Cinema } = require("../../../models/cinema.model");

module.exports.validateCreateCinema = async (req, res, next) => {
  const { cinema_Name, address } = req.body;

  const authSchema = Joi.object({
    cinema_Name: Joi.string().required().label("CinemaName"),
    // .messages({
    //     "string.base": "CinemaName invalid",
    //     "string.empty": "CinemaName invalid",
    //     "any.required": "CinemaName invalid"
    // })
    address: Joi.string().label("Address"),
    // .messages({
    //     "string.base": "Address invalid"
    // })
  });

  try {
    const cinema = await Cinema.findOne({ cinema_Name });
    const result = authSchema.validate(req.body, { abortEarly: false });
    let arrError = [];
    if (cinema) {
      arrError.push("Cinema exist");
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

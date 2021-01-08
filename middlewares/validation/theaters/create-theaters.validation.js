const validator = require("validator");
const __ = require("lodash");
const Joi = require("joi");
const errResult = require("../../../config/errors/errorResult");
const { Theaters } = require("../../../models/theaters.model");

module.exports.validateCreateTheaters = async (req, res, next) => {
  const { theaters_Name, info } = req.body;

  const authSchema = Joi.object({
    theaters_Name: Joi.string().required().label("TheatersName"),
    // .messages({
    //     "string.base": "TheatersName invalid",
    //     "string.empty": "TheatersName invalid",
    //     "any.required": "TheatersName invalid"
    // })
    info: Joi.string().label("Information"),
    // .messages({
    //     "string.base": "Info invalid"
    // })
    cinema_id: Joi.string().label("CinemaId").required(),
    // .messages({
    //     "string.base": "CinemaId invalid",
    //     "any.required": "CinemaId invalid",
    //     "string.empty": "CinemaId invalid"
    // })
    address: Joi.string().label("Address").required(),
    // .messages({
    //     "string.base": "Address invalid",
    //     "any.required": "Address invalid",
    //     "string.empty": "Address invalid"
    // })
  });

  try {
    const theaters = await Theaters.findOne({ theaters_Name });
    const result = authSchema.validate(req.body, { abortEarly: false });
    let arrError = [];
    if (theaters) {
      arrError.push("Theaters exist");
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
  } catch (error) {
    return res.json(error);
  }
};

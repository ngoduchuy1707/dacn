const validator = require("validator");
const __ = require("lodash");
const Joi = require("joi");
const errResult = require("../../../config/errors/errorResult");
const { Movie } = require("../../../models/movie.model");

module.exports.validateCreateMovie = async (req, res, next) => {
  const {
    name,
    directors,
    cast,
    genre,
    launchDate,
    time,
    description,
    trailer,
    maturity,
    category_id,
    bigImage,
    smallImage,
    status
  } = req.body;

  const authSchema = Joi.object({
    name: Joi.string().required().label("MovieName"),
    // .messages({
    //     "string.base": "MovieName invalid",
    //     "string.empty": "MovieName invalid",
    //     "string.min": "MovieName invalid",
    //     "string.max": "MovieName invalid",
    //     "any.required": "MovieName invalid",
    //     "string.pattern.base": "MovieName invalid"
    // })
    directors: Joi.string().label("Directors").required(),
    // .messages({
    //     "string.base": "Director invalid",
    //     "string.empty": "Director invalid",
    //     "string.min": "Director invalid",
    //     "string.max": "Director invalid",
    //     "any.required": "Director invalid",
    //     "string.pattern.base": "Director invalid"
    // })
    cast: Joi.array().label("Cast").required(),
    // .messages({
    //     "array.base": "Cast invalid",
    //     "string.empty": "Cast invalid",
    //     "string.min": "Cast invalid",
    //     "string.max": "Cast invalid",
    //     "any.required": "Cast invalid",
    //     "string.pattern.base": "Cast invalid"
    // })
    genre: Joi.string().label("Genre").required(),
    // .messages({
    //     "string.base": "Genre invalid",
    //     "string.empty": "Genre invalid",
    //     "string.min": "Genre invalid",
    //     "string.max": "Genre invalid",
    //     "any.required": "Genre invalid",
    //     "string.pattern.base": "Genre invalid"
    // })
    launchDate: Joi.date()
      //.pattern(new RegExp("^[0-9]{1,2}[-|/][0-9]{1,2}[-|/][0-9999]{4}$"))
      .label("LaunchDate")
      .required(),
    // .messages({
    //     "any.required": "LaunchDate invalid",
    //     "string.empty": "LaunchDate invalid",
    //     "any.required": "LaunchDate invalid"
    // })
    time: Joi.string().label("Time").required(),
    // .messages({
    //     "string.base": "Time invalid",
    //     "any.required": "Time invalid",
    //     "string.empty": "Time invalid",
    //     "string.base": "Time invalid "
    // })
    category_id: Joi.string().label("CategoryId").required(),
    // .messages({
    //     "string.base": "CategoryId invalid",
    //     "any.required": "CategoryId invalid",
    //     "string.empty": "CategoryId invalid"
    // })
    maturity: Joi.string().label("Maturity").required(),
    // .messages({
    //     "string.base": "Maturity invalid",
    //     "any.required": "Maturity invalid",
    //     "string.empty": "Maturity invalid"
    // })
    description: Joi.string().label("Description").empty(""),
    trailer: Joi.string().label("Trailer").required(),
    // .messages({
    //     "string.empty": "Trailer invalid",
    //     "any.required": "Trailer invalid",
    //     "object.base": "Trailer invalid"
    // })
    status: Joi.string().empty(""),
    bigImage: Joi.string(),
    smallImage: Joi.string()
  });

  try {
    const movie = await Movie.findOne({ name: name });
    const result = authSchema.validate(req.body, { abortEarly: false });
    let arrError = [];
    if (movie) {
      arrError.push("Movie exist");
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

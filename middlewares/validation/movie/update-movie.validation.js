// const validator = require("validator")
// const __ = require("lodash")
// const Joi = require("joi")
// const errResult = require("../../../config/errors/errorResult")
// const { Movie } = require("../../../models/movie.model")

// module.exports.validateUpdateMovie = async (req, res, next) => {
//     const { movie_Name, directors, cast, genre, launchDate, time, desc } = req.body
//     switch (req.body) {
//         case movie_Name:
//             const authSchema = Joi.object({
//                 movie_Name: Joi.string()
//                     .required()
//                     .label("MovieName")
//                     .messages({
//                         "string.base": "MovieName invalid",
//                         "string.empty": "MovieName invalid",
//                         "string.min": "MovieName invalid",
//                         "string.max": "MovieName invalid",
//                         "any.required": "MovieName invalid",
//                         "string.pattern.base": "MovieName invalid"
//                     })
//             })
//             break;
//         case directors:
//             const authSchema = Joi.object({
//                 directors: Joi.string()
//                     .label("Directors")
//                     .required()
//                     .messages({
//                         "string.base": "Director invalid",
//                         "string.empty": "Director invalid",
//                         "string.min": "Director invalid",
//                         "string.max": "Director invalid",
//                         "any.required": "Director invalid",
//                         "string.pattern.base": "Director invalid"
//                     })
//             })
//             break;
//         case cast:
//             const authSchema = Joi.object({
//                 cast: Joi.string()
//                     .label("Cast")
//                     .required()
//                     .messages({
//                         "string.base": "Cast invalid",
//                         "string.empty": "Cast invalid",
//                         "string.min": "Cast invalid",
//                         "string.max": "Cast invalid",
//                         "any.required": "Cast invalid",
//                         "string.pattern.base": "Cast invalid"
//                     })
//             })
//             break;
//         case genre:
//             const authSchema = Joi.object({
//                 genre: Joi.string()
//                     .label("Genre")
//                     .required()
//                     .messages({
//                         "string.base": "Genre invalid",
//                         "string.empty": "Genre invalid",
//                         "string.min": "Genre invalid",
//                         "string.max": "Genre invalid",
//                         "any.required": "Genre invalid",
//                         "string.pattern.base": "Genre invalid"
//                     })
//             })
//             break;
//         case launchDate:
//             const authSchema = Joi.object({
//                 launchDate: Joi.date()
//                     .pattern(new RegExp("^[0-9]{1,2}[-|/][0-9]{1,2}[-|/][0-9999]{4}$"))
//                     .label("Address")
//                     .required()
//                     .messages({
//                         "any.required": "LaunchDate invalid",
//                         "string.empty": "LaunchDate invalid"
//                     })
//             })
//             break;
//         case time:
//             const authSchema = Joi.object({
//                 time: Joi.string()
//                     .label("Time")
//                     .required()
//                     .messages({
//                         "string.base": "Time invalid",
//                         "any.required": "Time invalid",
//                         "string.empty": "Time invalid",
//                         "string.base": "Time invalid"
//                     })
//             })
//             break;
//         default:
//             break;
//     }

//     try {
//         const movie = await Movie.find(
//             {
//                 movie_Name: movie_Name,
//                 launchDate: launchDate
//             })
//         const result = authSchema.validate(req.body, { abortEarly: false })
//         let arrError = []
//         if (movie) {
//             arrError.push("Movie invalid")
//         }
//         if (result.error) {
//             result.error.details.map(x => {
//                 arrError.push(x.message)
//             })
//         }
//         if (Object.keys(arrError).length > 0) {
//             throw {
//                 error: arrError
//             }
//         }
//         else {
//             return next()
//         }
//     } catch (error) {
//         return res.json(error)
//     }
// }




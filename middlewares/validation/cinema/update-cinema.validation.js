// const validator = require("validator")
// const __ = require("lodash")
// const Joi = require("joi")
// const errResult = require("../../../config/errors/errorResult")
// const { Cinema } = require("../../../models/cinema.model")

// module.exports.validateUpdateCinema = async (req, res, next) => {
//     const { cinema_Name, address } = req.body
//     switch (req.body) {
//         case cinema_Name:
//             const authSchema = Joi.object({
//                 cinema_Name: Joi.string()
//                     .required()
//                     .label("CinemaName")
//                     .messages({
//                         "string.base": "CinemaName invalid",
//                         "string.empty": "CinemaName invalid",
//                         "any.required": "CinemaName invalid"
//                     })
//             })
//             break;
//         default:
//             break;
//     }

//     try {
//         const cinema = await Cinema.findOne({ cinema_Name })
//         const result = authSchema.validate(req.body, { abortEarly: false })
//         let arrError = []
//         if (cinema) {
//             arrError.push("Cinema invalid")
//         }
//         if (result.error) {
//             result.error.details.map(x => { arrError.push(x.message) })
//         }
//         if (Object.keys(arrError).length > 0) {
//             throw { error: arrError }
//         }
//         else {
//             return next()
//         }
//     } catch (error) {
//         return res.json(error)
//     }
// }




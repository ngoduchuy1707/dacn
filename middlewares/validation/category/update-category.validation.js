// const validator = require("validator")
// const __ = require("lodash")
// const Joi = require("joi")
// const errResult = require("../../../config/errors/errorResult")
// const { Category } = require("../../../models/category.model")

// module.exports.validateUpdateCategory = async (req, res, next) => {
//     const { category_Name, desc } = req.body
//     switch (req.body) {
//         case category_Name:
//             const authSchema = Joi.object({
//                 category_Name: Joi.string()
//                     .required()
//                     .label("CategoryName")
//                     .messages({
//                         "string.base": "CategoryName invalid",
//                         "string.empty": "CategoryName invalid",
//                         "any.required": "CategoryName invalid"
//                     })
//             })
//             break;
//         default:
//             break;
//     }

//     try {
//         const category = await Category.findOne({ category_Name })
//         const result = authSchema.validate(req.body, { abortEarly: false })
//         let arrError = []
//         if (category) {
//             arrError.push("Category invalid")
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




const validator = require("validator")
const Joi = require("joi")
const errResult = require("../../../config/errors/errorResult")
const { User } = require("../../../models/user.model")

module.exports.validateUpdateFullname = async (req, res, next) => {
    const { fullName } = req.body;
    const schema = Joi.object({
        fullName: Joi.string()
            .trim()
            .alphanum()
            .min(3)
            .max(30)
            .regex(/^[a-zA-Z]+$/)
            .label("Fullname")
            .required()
            .messages({
                "string.base": "Fullname invalid",
                "string.empty": "Fullname invalid",
                "string.min": "Fullname invalid",
                "string.max": "Fullname invalid",
                "any.required": "Fullname invalid",
                "string.pattern.base": "Fullname invalid"
            })
    })
    try {
        const user = await User.findById(req.user._id)
        const res = schema.validate(req.body, { abortEarly: false })
        let arrError = []
        if (!user) {
            arrError.push("Email invalid")
        }
        if (res.error) {
            res.error.details.map(x => { arrError.push(x.message) })
        }
        if (Object.keys(arrError).length > 0) {
            throw { error: arrError }
        }
        else {
            next()
        }
    } catch (error) {
        return res.json({ error })
    }
}
const validator = require("validator");
const __ = require("lodash");
const Joi = require("joi");
const errResult = require("../../../config/errors/errorResult");
const { Food } = require("../../../models/food.model");

module.exports.validateCreateFood = async (req, res, next) => {
  const { food_Name, food_Price, quantity, desc } = req.body;

  const authSchema = Joi.object({
    food_Name: Joi.string().label("FoodName").required(),
    // .messages({
    //     "string.base": "FoodName invalid",
    //     "string.empty": "FoodName invalid",
    //     "any.required": "FoodName invalid"
    // })
    food_Price: Joi.string()
      .label("FoodPrice")
      .pattern(new RegExp("^[0-9]{3,7}$"))
      .min(3)
      .max(7)
      .required(),
    // .messages({
    //     "string.base": "FoodPrice invalid",
    //     "string.empty": "FoodPrice invalid",
    //     "string.min": "FoodPrice invalid",
    //     "string.max": "FoodPrice invalid",
    //     "any.required": "FoodPrice invalid",
    //     "string.pattern.base": "FoodPrice invalid"
    // })
    quantity: Joi.string()
      .label("Quantity")
      .pattern(new RegExp("^[0-9]$"))
      .min(0)
      .max(999)
      .required(),
    // .messages({
    //     "string.base": "Quantity invalid",
    //     "string.empty": "Quantity invalid",
    //     "string.min": "Quantity invalid",
    //     "string.max": "Quantity invalid",
    //     "any.required": "Quantity invalid",
    //     "string.pattern.base": "Quantity invalid"
    // })
  });

  try {
    const food = await Food.findOne({ food_Name });
    const result = authSchema.validate(req.body, { abortEarly: false });
    let arrError = [];
    if (food) {
      arrError.push("Food exist");
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

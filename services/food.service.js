const { mongo } = require("mongoose");
const errorResult = require("../config/errors/errorResult");
const { Food } = require("../models/food.model");
const { Ticket } = require("../models/ticket.model");

//GET FOOD
module.exports.getFood = async (req, res, next) => {
  try {
    const [food, count] = await Promise.all([
      Food.find().sort({ price: -1 }),
      Food.count(),
    ]);

    if (!food || (food && food.length < 1)) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: food,
        total_page: count,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//GET FOOD BY ID
module.exports.getFoodById = async (req, res, next) => {
  try {
    const { foodId } = req.params;
    const food = await Bill.findById(foodId);
    if (!food) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: food,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//CREATE FOOD
module.exports.createFood = async (req, res, next) => {
  try {
    const { food_Name, price, quantity, desc } = req.body;
    const food = await Food.create({
      food_Name,
      price,
      quantity,
      desc,
    });
    return res.json({
      message: errorResult.success,
      data: food,
    });
  } catch (error) {
    return res.json(error);
  }
};

// UPDATE FOOD
module.exports.updateFood = async (req, res, next) => {
  try {
    const { foodId } = req.params;
    const { food_Name, food_Price, quantity, desc } = req.body;
    const food = await Food.findByIdAndUpdate(
      { _id: foodId },
      { food_Name, food_Price, quantity, desc },
      { new: true }
    );
    if (!food) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: food,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//DELETE FOOD
module.exports.deleteFood = async (req, res, next) => {
  try {
    const { foodId } = req.params;
    const food = await Food.findById(foodId);
    let _food;
    if (!food) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      _food = food;
      food.deleteOne();
      return res.json({
        message: errorResult.success,
        data: food,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

const multer = require("multer");
const errorResult = require("../config/errors/errorResult");
const { uploadImage } = require("../middlewares/images/index");
const { Category } = require("../models/category.model");
const { Movie } = require("../models/movie.model");

//GET CATEGORY
module.exports.getCategory = async (req, res, next) => {
  try {
    const [category, count] = await Promise.all([
      Category.find(),
      Category.countDocuments(),
    ]);
    if (!category) {
      throw {
        error: errorResult.badRequest,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: category,
        total_page: count,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//GET CATEGORY BY ID
module.exports.getCategoryById = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    if (!category) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: category,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//CREATE CATEGORY
module.exports.createCategory = async (req, res, next) => {
  try {
    const { category_Name, desc } = req.body;
    const category = await Category.findOne({ category_Name });
    if (category) {
      throw {
        error: errorResult.badRequest,
      };
    }
    let newCategory = new Category({ category_Name, desc });
    newCategory.save((err, result) => {
      if (err) {
        throw {
          error: errorResult.badRequest,
        };
      }
      return res.json({
        message: errorResult.success,
        data: result,
      });
    });
  } catch (error) {
    return res.json(error);
  }
};

// UPDATE CATEGORY
module.exports.updateCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { category_Name, desc } = req.body;
    const category = await Category.findByIdAndUpdate(
      { _id: categoryId },
      { category_Name, desc },
      { new: true }
    );
    if (!category) {
      throw { error: errorResult.notFound };
    } else {
      return res.json({
        message: errorResult.success,
        data: category,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//DELETE CATEGORY
module.exports.deleteCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    let _category;
    if (!category) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      _category = category;
      category.deleteOne();
      return res.json({
        message: errorResult.success,
        data: _category,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//UPLOAD IMAGE
module.exports.uploadCategoryImage = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    if (!category) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      category.category_Image = `${req.file.fieldname}s/${req.file.filename}`;
      uploadImage("category_Image");
      category.save();
      return res.json({
        message: errorResult.success,
        data: category,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//FILTER BY NAME
module.exports.filterCategoryByName = async (req, res, next) => {
  try {
    const { categoryName } = req.query;
    const category = await Category.find({ category_Name: categoryName });
    if (!category) {
      throw {
        error: errorResult.notFound,
      };
    }
    if (category.length < 0) {
      throw { error: null };
    } else {
      return res.json({
        message: errorResult.success,
        data: category,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

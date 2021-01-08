const express = require("express");
const router = express.Router();
const passport = require("passport");

const { validateCreateCategory } = require("../middlewares/validation/category/create-category.validation");
const { validationUpdateCategory } = require("../middlewares/validation/category/update-category.validation");
const { authorizing } = require("../middlewares/auth/index");
const { uploadImage } = require("../middlewares/images/index");
const categoryService = require("../services/category.service");

//FILTER CATEGORY BY NAME
router.get(
    "/categories/categoryName",
    categoryService.filterCategoryByName
);

//CREATE CATEGORY BY ADMIN
router.post(
    "/categories/create",
    //validateCreateCategory,
    passport.authenticate("jwt", { session: false }),
    authorizing(["admin"]),
    categoryService.createCategory
);

//UPDATE CATEGORY BY ADMIN
router.put(
    "/categories/update/:categoryId",
    //validationUpdateCategory,
    passport.authenticate("jwt", { session: false }),
    authorizing(["admin"]),
    categoryService.updateCategory
);

//GET CATEGORY BY ID
router.get(
    "/categories/:categoryId",
    categoryService.getCategoryById
);

//GET CATEGORY
router.get(
    "/categories",
    categoryService.getCategory
);

//DELETE CATEGORY BY ADMIN
router.delete(
    "/categories/:categoryId",
    passport.authenticate("jwt", { session: false }),
    authorizing(["admin"]),
    categoryService.deleteCategory
);

//UPLOAD IMAGE BY ADMIN
router.post(
    "/categories/upload-image/:categoryId",
    passport.authenticate("jwt", { session: false }),
    authorizing(["admin"]),
    uploadImage("category_Image"),
    categoryService.uploadCategoryImage
);

module.exports = router;
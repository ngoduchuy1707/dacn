const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    category_Name: {
        type: String,
        required: true
    },
    desc: {
        type: String
    },
    category_Image: {
        type: String
    }
});

const Category = mongoose.model("Category", categorySchema, "Category");

module.exports = {
    categorySchema, Category
}
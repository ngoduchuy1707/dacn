const mongoose = require("mongoose");
const { Ticket } = require("./ticket.model");

const foodSchema = new mongoose.Schema({
    food_Name: {
        type: String,
        required: true
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number
    },
    desc: {
        type: String
    },
    food_Image: {
        type: String
    }
});

const Food = mongoose.model("Food", foodSchema, "Food");

module.exports = {
    foodSchema, Food
}

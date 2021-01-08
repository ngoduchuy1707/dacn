const mongoose = require("mongoose");
const { SeatSchema } = require("./seat.model");
const { Cinema } = require("./cinema.model");
const { Movie } = require("./movie.model");
const { Theaters } = require("./theaters.model");
const { Food } = require("./food.model");


const tixSchema = new mongoose.Schema({
    tix_Name: {
        type: String,
        required: true
    },
    tix_Price: {
        type: Number,
        default: 0
    }
});

const Tix = mongoose.model("Tix", tixSchema, "Tix");

module.exports = {
    tixSchema, Tix
}
const mongoose = require("mongoose");

const cinemaSchema = new mongoose.Schema({
    cinema_Name: {
        type: String,
        required: true
    },
    address: {
        type: String
    }
});

const Cinema = mongoose.model("Cinema", cinemaSchema, "Cinema");

module.exports = {
    cinemaSchema, Cinema
}
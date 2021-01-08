const mongoose = require("mongoose");
const { Cinema } = require("./cinema.model");
const { Movie } = require("./movie.model");
const { Theaters } = require("./theaters.model");
const { Food } = require("./food.model");

const ticketSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    cinemaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cinema"
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie"
    },
    theatersId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Theaters"
    },
    food_Name: {
        type: String
    },
    tixId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tix"
    },
    time: {
        type: String
    },
    date: {
        type: Date
    },
    status: {
        type: String,
        default: "waiting"
    },
    seats: [{
        type: String
    }],
    totalPrice: {
        type: Number
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
});

const Ticket = mongoose.model("Ticket", ticketSchema, "Ticket");

module.exports = {
    ticketSchema, Ticket
}
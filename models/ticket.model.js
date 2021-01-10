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
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session"
    },
    food_Name: {
        type: String
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
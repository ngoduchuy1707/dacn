const mongoose = require("mongoose");
const { Cinema } = require("./cinema.model");
const { Movie } = require("./movie.model");
const { Theaters } = require("./theaters.model");
const { Ticket } = require("./ticket.model");

const billSchema = new mongoose.Schema({
    cinema_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cinema"
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    movie_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie"
    },
    theaters_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Theaters"
    },
    ticket_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket"
    },
    timeCreate: {
        type:String,
        default: Date.now()
    },
    status: {
        type: String,
        default: "waiting"
    }
});

const Bill = mongoose.model("Bill", billSchema, "Bill");

module.exports = {
    billSchema, Bill
}
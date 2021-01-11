const mongoose = require("mongoose");
const { Cinema } = require("./cinema.model");
const { Movie } = require("./movie.model");
const { Theaters } = require("./theaters.model");
const { Ticket } = require("./ticket.model");

const billSchema = new mongoose.Schema({
    amount: {
        type: Number
    },
    bankCode: {
        type: String
    },
    transactionsId: {
        type: String
    },
    ticket_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket"
    },
    timeCreate: {
        type: String,
        default: Date.now()
    },
    status: {
        type: String,
        default: "Success"
    }
});

const Bill = mongoose.model("Bill", billSchema, "Bill");

module.exports = {
    billSchema, Bill
}
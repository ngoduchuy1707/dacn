const mongoose = require("mongoose");
const { SeatSchema } = require("./seat.model");

const theatersSchema = new mongoose.Schema({
  theaters_Name: {
    type: String,
    required: true
  },
  cinema_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cinema"
  },
  info: {
    type: String,
    required: true
  },
  seats: [SeatSchema]
});

const Theaters = mongoose.model("Theaters", theatersSchema, "Theaters");

module.exports = {
  theatersSchema, Theaters
}
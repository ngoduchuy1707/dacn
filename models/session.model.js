const mongoose = require("mongoose");
const { Cinema } = require("./cinema.model");
const { Movie } = require("./movie.model");
const { Theaters } = require("./theaters.model");

const sessionSchema = new mongoose.Schema({
  cinema_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cinema",
  },
  theaters_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theaters",
  },
  price: {
    type: Number,
  },
  movie_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
  },
  time: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true
  }
});

const Session = mongoose.model("Session", sessionSchema, "Session");

module.exports = {
  sessionSchema,
  Session,
};

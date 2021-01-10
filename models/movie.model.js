const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  directors: {
    type: String,
  },
  cast: [
    {
      type: String,
      required: true,
    },
  ],
  genre: [
    {
      type: String,
      required: true,
    },
  ],
  launchDate: {
    //ngay khoi chieu
    type: Date,
    default: 0,
  },
  time: {
    //thoi luong
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    default: "coming-soon",
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  maturity: {
    type: String,
  },
  trailer: {
    type: String,
  },
  bigImage: {
    type: String,
  },
  smallImage: {
    type: String,
  },
});

const Movie = mongoose.model("Movie", movieSchema, "Movie");

module.exports = {
  movieSchema,
  Movie,
};

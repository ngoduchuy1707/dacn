const errorResult = require("../config/errors/errorResult");
const handleString = require("../middlewares/handle/handle-string");
const { Movie } = require("../models/movie.model");
const { Cinema } = require("../models/cinema.model");

//GET CINEMA
module.exports.getCinema = async (req, res, next) => {
  try {
    const [cinema, count] = await Promise.all([Cinema.find(), Cinema.countDocuments()]);

    if (!cinema) {
      throw {
        error: errorResult.badRequest,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: cinema,
        total_page: count,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//GET CINEMA BY ID
module.exports.getCinemaById = async (req, res, next) => {
  try {
    const { cinemaId } = req.params;
    const cinema = await Cinema.findById(cinemaId);
    if (!cinema) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: cinema,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//CREATE CINEMA
module.exports.createCinema = async (req, res, next) => {
  try {
    const { cinema_Name, address, lat, lng } = req.body;
    const cinema = await Cinema.create({
      cinema_Name,
      address,
      lat,
      lng
    });
    return res.json({
      message: errorResult.success,
      data: cinema,
    });
  } catch (error) {
    return res.json(error);
  }
};

// UPDATE CINEMA
module.exports.updateCinema = async (req, res, next) => {
  try {
    const { cinemaId } = req.params;
    const { cinema_Name, address, lat, lng } = req.body;
    const cinema = await Cinema.findByIdAndUpdate(
      { _id: cinemaId },
      { cinema_Name, address, lat, lng },
      { new: true }
    );
    if (!cinema) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: cinema,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//DELETE CINEMA
module.exports.deleteCinema = async (req, res, next) => {
  try {
    const { cinemaId } = req.params;
    const cinema = await Cinema.findById(cinemaId);
    let _cinema;
    if (!cinema) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      _cinema = cinema;
      cinema.deleteOne();
      return res.json({
        message: errorResult.success,
        data: _cinema,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//SEARCH MOVIE
module.exports.searchMovie = async (req, res, next) => {
  try {
    const movieName = handleString.cleanAccents(req.query.name);
    const regex = new RegExp(req.query.name, "i");
    const cinema = await Movie.find({ name: regex });
    if (cinema.length <= 0) {
      throw {
        message: errorResult.notFound,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: cinema,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

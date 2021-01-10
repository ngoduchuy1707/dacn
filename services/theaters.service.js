const errorResult = require("../config/errors/errorResult");

const { Seat } = require("../models/seat.model");
const { Theaters } = require("../models/theaters.model");
const { Cinema } = require("../models/cinema.model");
const { filter } = require("lodash");

const seatCodeArray = [
  "A01",
  "A02",
  "A03",
  "A04",
  "A05",
  "A06",
  "A07",
  "A08",
  "A09",
  "A10",
  "A11",
  "A12",
  "B01",
  "B02",
  "B03",
  "B04",
  "B05",
  "B06",
  "B07",
  "B08",
  "B09",
  "B10",
  "B11",
  "B12",
  "C01",
  "C02",
  "C03",
  "C04",
  "C05",
  "C06",
  "C07",
  "C08",
  "C09",
  "C10",
  "C11",
  "C12",
];
// GET THEATERS
module.exports.getTheaters = async (req, res, next) => {
  try {
    const [theaters, count] = await Promise.all([
      Theaters.find().populate({ path: 'cinema_id', select: 'cinema_Name' }),
      Theaters.countDocuments()
    ]);
    if (!theaters) {
      throw {
        error: errorResult.badRequest,
      };
    }
    else {
      return res.json({
        message: errorResult.success,
        data: theaters,
        total_page: count,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

// GET THEATERS BY ID
module.exports.getTheatersById = async (req, res, next) => {
  try {
    const { theatersId } = req.params;
    let cinemaName;
    const theaters = await Theaters.findById(theatersId).populate({ path: 'cinema_id', select: 'cinema_Name' });
    if (!theaters) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: theaters
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//GET THEATERS BY CINEMA
module.exports.getTheatersByCinema = async (req, res, next) => {
  try {
    const { cinema } = req.query;
    const theaters = await Theaters.find({ cinema_id: cinema }).populate({ path: 'cinema_id', select: 'cinema_Name' });
    if (!theaters || theaters.length < 1) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: theaters,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//CREATE THEATERS
module.exports.createTheaters = async (req, res, next) => {
  try {
    const { theaters_Name, cinema_id, info } = req.body;
    const cinema = await Cinema.findById(cinema_id);
    const theatersName = await Theaters.findOne({ theaters_Name });
    if (!cinema) {
      throw {
        error: errorResult.notFound,
      };
    }
    if (theatersName) {
      throw {
        error: errorResult.badRequest,
      };
    }
    const seats = seatCodeArray.map((code) => {
      return new Seat({ code });
    });
    const theaters = await Theaters.create({
      theaters_Name,
      cinema_id,
      info,
      seats,
    });
    return res.json({
      message: errorResult.success,
      data: theaters,
    });
  } catch (error) {
    return res.json(error);
  }
};

// UPDATE THEATERS
module.exports.updateTheaters = async (req, res, next) => {
  try {
    const { theatersId } = req.params;
    const { cinema_id, theaters_Name, info } = req.body;
    let theaters;
    if (cinema_id === "" || cinema_id === undefined) {
      theaters = await Theaters.findByIdAndUpdate(
        { _id: theatersId },
        { theaters_Name, info },
        { new: true }
      );
    } else {
      const cinema = await Cinema.findById(cinema_id);
      if (!cinema) {
        throw {
          error: errorResult.notFound,
        };
      } else {
        theaters = await Theaters.findByIdAndUpdate(
          { _id: theatersId },
          { theaters_Name, info, cinema_id },
          { new: true }
        );
      }
    }
    return res.json({
      message: errorResult.success,
      data: theaters,
    });
  } catch (error) {
    return res.json(error);
  }
};

// DELETE THEATERS
module.exports.deleteTheaters = async (req, res, next) => {
  try {
    const { theatersId } = req.params;
    const theaters = await Theaters.findById(theatersId);
    let _theaters;
    if (!theaters) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      _theaters = theaters;
      theaters.deleteOne();
      return res.json({
        message: errorResult.success,
        data: _theaters,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

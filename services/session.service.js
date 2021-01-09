const mongoose = require("mongoose");
const errorResult = require("../config/errors/errorResult");
const { Session } = require("../models/session.model");
const { Movie } = require("../models/movie.model");
const { Theaters } = require("../models/theaters.model");
const { Cinema } = require("../models/cinema.model");

//GET SESSION
module.exports.getSession = async (req, res, next) => {
  try {
    const [sessions, count, cinemas, theaters] = await Promise.all([
      Session.find(),
      Session.countDocuments(),
      Cinema.find(),
      Theaters.find(),
    ]);
    if (!sessions) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      let theaterRecords = [];
      let theaterRecord = {};
      let cinemaRecords = [];
      let cinemaRecord = {};
      let data = [];
      let dataFinal = [];
      let record = {};
      sessions.map((session, index) => {
        theaterRecord = theaters.find((theater) => {
          return (theater._id).toString() === (session.theaters_id).toString()
        })
        theaterRecords.push(theaterRecord);
        if (theaterRecords.length === sessions.length) {
          sessions.map((session, index) => {
            record = {
              ...session._doc,
              theater_Name: theaterRecords[index].theaters_Name,
            }
            data.push(record);
          })
        }
        cinemaRecord = cinemas.find((cinema) => {
          return (cinema._id).toString() === (session.cinema_id).toString()
        })
        cinemaRecords.push(cinemaRecord);
        if (cinemaRecords.length === data.length) {
          data.map((item, index) => {
            item = {
              ...item,
              cinema_Name : cinemaRecords[index].cinema_Name,
              cinema_Address : cinemaRecords[index].address
            }
            dataFinal.push(item)
          })
        }
      })
      console.log('dataFinal: ', dataFinal);
      return res.json({
        message: errorResult.success,
        data: dataFinal,
        total_page: count
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//GET SESSION BY ID
module.exports.getSessionById = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId);
    if (!session) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: session,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//CREATE SESSION
module.exports.createSession = async (req, res, next) => {
  try {
    const { movie_id, cinema_id, theaters_id, price, time } = req.body;
    const movie = await Movie.findById(movie_id);
    const cinema = await Cinema.findById(cinema_id);
    const theaters = await Theaters.findById(theaters_id);
    const result = await Session.find({
      movie_id: movie_id,
      time: time,
      cinema_id: cinema_id,
    });
    if (result && result.length > 0) {
      throw {
        error: errorResult.badRequest,
      };
    }
    if (!movie || !cinema || !theaters) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      const session = await Session.create({
        movie_id,
        cinema_id,
        theaters_id,
        price,
        time,
      });
      return res.json({
        message: errorResult.success,
        data: session,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

// UPDATE SESSION
module.exports.updateSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { movie_id, cinema_id, theaters_id, price, time } = req.body;
    const movie = await Movie.findById(movie_id);
    const cinema = await Cinema.findById(cinema_id);
    const theaters = await Theaters.findById(theaters_id);
    const session = await Session.findById(sessionId);
    if (!session) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      if (!movie || !cinema || !theaters) {
        throw {
          error: errorResult.notFound,
        };
      } else {
        session.movie_id = req.body.movie_id
          ? req.body.movie_id
          : session.movie_id;
        session.cinema_id = req.body.cinema_id
          ? req.body.cinema_id
          : session.cinema_id;
        session.theaters_id = req.body.theaters_id
          ? req.body.theaters_id
          : session.theaters_id;
        session.time = req.body.time ? req.body.time : session.time;
        session.price = req.body.price ? req.body.price : session.price;
      }
      session.save();
      return res.json({
        message: errorResult.success,
        data: session,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//DELETE SESSION
module.exports.deleteSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId);
    let _session;
    if (!session) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      _session = session;
      session.deleteOne();
      return res.json({
        message: errorResult.success,
        data: _session,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

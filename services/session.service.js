const mongoose = require("mongoose");
const errorResult = require("../config/errors/errorResult");
const { Session } = require("../models/session.model");
const { Movie } = require("../models/movie.model");
const { Theaters } = require("../models/theaters.model");
const { Cinema } = require("../models/cinema.model");

//GET SESSION
module.exports.getSession = async (req, res, next) => {
  try {
    const [sessions, count] = await Promise.all([
      Session
        .find()
        .populate({ path: 'movie_id cinema_id theaters_id', select: 'name cinema_Name address theaters_Name' }),
      Session.countDocuments(),
    ]);
    if (!sessions) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: sessions,
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
    const session = await Session
      .findById(sessionId)
      .populate({ path: 'movie_id cinema_id theaters_id', select: 'name cinema_Name address theaters_Name' });
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

//GET SESSION BY MOVIE ID
module.exports.getSessionByMovieId = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const [session, count] = await Promise.all([
      Session
        .find({ movie_id: movieId })
        .populate({ path: 'cinema_id movie_id theaters_id', select: 'cinema_Name address name theaters_Name' }),
      Session.countDocuments()
    ])
    if (!session) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: session,
        total_page: count
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//CREATE SESSION
module.exports.createSession = async (req, res, next) => {
  try {
    const { movie_id, cinema_id, theaters_id, price, time, date } = req.body;
    const movie = await Movie.findById(movie_id);
    const cinema = await Cinema.findById(cinema_id);
    const theaters = await Theaters.findById(theaters_id);
    const result = await Session.find({
      movie_id: movie_id,
      time: time,
      date: date,
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
        date
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
    const { movie_id, cinema_id, theaters_id, price, time, date } = req.body;
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
          error: errorResult.badRequest,
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
        session.date = req.body.time ? req.body.date : session.date;
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

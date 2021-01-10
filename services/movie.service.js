const mongoose = require("mongoose");
const errorResult = require("../config/errors/errorResult");
const { Movie } = require("../models/movie.model");
const { Category } = require("../models/category.model");
const { Theaters } = require("../models/theaters.model");
const { Session } = require("../models/session.model");

//GET MOVIE
module.exports.getMovie = async (req, res, next) => {
  try {
    const [movie, count] = await Promise.all([
      Movie
        .find()
        .populate({ path: 'category_id', select: 'category_Name' }),
      Movie.countDocuments(),
    ]);
    if (!movie) {
      throw {
        error: errorResult.badRequest,
      };
    }
    if (movie.length < 1) {
      throw { error: null };
    } else {
      return res.json({
        message: errorResult.success,
        data: movie,
        total_page: count,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//GET MOVIE BY ID
module.exports.getMovieById = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId).populate({ path: 'category_id', select: 'category_Name' });
    if (!movie) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: movie,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//GET MOVIE BY STATUS
module.exports.getByStatus = async (req, res, next) => {
  try {
    const status = new RegExp(req.query.status, "i");
    const [movie, count] = await Promise.all([
      Movie.find({ status: status }).populate({ path: 'category_id', select: 'category_Name' }),
      Movie.count({ status: status }),
    ]);
    if (!movie || (movie && movie.length < 1)) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: movie,
        total_page: count,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//GET MOVIE LIST BY TIME
module.exports.getMovieByTime = async (req, res, next) => {
  try {
    const { time } = req.query;
    const handle = handleDate(time);
    const [movie, count] = await Promise.all([
      Movie.find({ launchDate: handle }),
      Movie.count(),
    ]);
    if (!movie || (movie && movie.length < 1)) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: movie,
        total_page: count,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//CREATE MOVIE
module.exports.createMovie = async (req, res, next) => {
  try {
    const {
      name,
      directors,
      cast,
      time,
      description,
      genre,
      category_id,
      launchDate,
      maturity,
      trailer,
      bigImage,
      smallImage
    } = req.body;
    const category = await Category.find({ category_id });
    if (!category) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      const movie = await Movie.create({
        name,
        directors,
        cast,
        description,
        genre,
        time,
        category_id,
        launchDate,
        maturity,
        trailer,
        bigImage,
        smallImage
      });
      return res.json({
        message: errorResult.success,
        data: movie,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

// UPDATE MOVIE
module.exports.updateMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    let result;
    const {
      name,
      directors,
      cast,
      genre,
      launchDate,
      time,
      description,
      status,
      category_id,
      maturity,
      trailer,
      bigImage,
      smallImage
    } = req.body;
    if (category_id === "" || category_id === undefined) {
      result = await Movie.findOneAndUpdate(
        { _id: movieId },
        {
          name,
          directors,
          cast,
          genre,
          launchDate,
          time,
          description,
          status,
          trailer,
          maturity,
          bigImage,
          smallImage
        },
        { new: true }
      );
    } else {
      const category = await Category.findById(category_id);
      if (!category) {
        throw {
          error: errorResult.notFound,
        };
      } else {
        result = await Movie.findOneAndUpdate(
          { _id: movieId },
          {
            name,
            directors,
            cast,
            genre,
            launchDate,
            time,
            description,
            maturity,
            trailer,
            status,
            category_id,
            bigImage,
            smallImage
          },
          { new: true }
        );
      }
    }
    return res.json({
      message: errorResult.success,
      data: result,
    });
  } catch (error) {
    return res.json(error);
  }
};

//DELETE MOVIE
module.exports.deleteMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId);
    let _movie;
    if (!movie) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      _movie = movie;
      movie.deleteOne();
      return res.json({
        message: errorResult.success,
        data: _movie,
      });
    }
  } catch (error) {
    next(error);
  }
};

//UPLOAD IMAGE
module.exports.uploadBigImage = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      movie.bigImage = `${req.file.fieldname}s/${req.file.filename}`;
      movie.save();
      return res.json({
        message: errorResult.success,
        data: movie,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports.uploadSmallImage = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      movie.smallImage = `${req.file.fieldname}s/${req.file.filename}`;
      movie.save();
      return res.json({
        message: errorResult.success,
        data: movie,
      });
    }
  } catch (error) {
    next(error);
  }
};

//FILTER BY DATE
module.exports.filterByDate = async (req, res, next) => {
  try {
    const date = req.query.date;
    const movie = await Movie.find({
      $and: [{ status: "coming-soon" }, { launchDate: date }],
    });
    if (!movie) {
      throw {
        error: errorResult.notFound,
      };
    }
    if (movie.length <= 0) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: movie,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//GET MOVIE BY CATEGORY
module.exports.getMovieByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.query;
    const [movie, count] = await Promise.all([
      Movie.find({ category_id: categoryId }).populate({ path: 'category_id', select: 'category_Name' }),
      Movie.count(),
    ]);
    if (!movie) {
      throw {
        error: errorResult.notFound,
      };
    }
    if (movie.length < 1) {
      throw { error: null };
    } else {
      return res.json({
        message: errorResult.success,
        data: movie,
        total_page: count,
      });
    }
  } catch (error) {
    next(error);
  }
};


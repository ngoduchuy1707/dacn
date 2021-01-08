const express = require("express");
const router = express.Router();
const passport = require("passport");

const { authorizing } = require("../middlewares/auth/index");
const { uploadImage } = require("../middlewares/images/index");
const { validateUpdateMovie } = require("../middlewares/validation/movie/update-movie.validation");
const { validateCreateMovie } = require("../middlewares/validation/movie/create-movie.validation");
const movieService = require("../services/movie.service");

// router.post(
//   "/movies/upload-smallimage/:movieId",
//   passport.authenticate("jwt", { session: false }),
//   authorizing(["admin"]),
//   uploadImage("movie_Image"),
//   movieService.uploadSmallImage
// );

// //UPLOAD IMAGE
// router.post(
//   "/movies/upload-image/:movieId",
//   passport.authenticate("jwt", { session: false }),
//   authorizing(["admin"]),
//   uploadImage("movie_Image"),
//   movieService.uploadBigImage
// );

//GET MOVIE BY CATEGORY
router.get(
  "/movies/get-by-category",
  movieService.getMovieByCategory
);

//FILTER DATE
router.get(
  "/movies/filter-date",
  movieService.filterByDate
);

//GET MOVIE BY STATUS
router.get(
  "/movies/status",
  movieService.getByStatus
);

//GET MOVIE BY ID
router.get(
  "/movies/:movieId",
  passport.authenticate("jwt", { session: false }),
  authorizing(["admin"]),
  movieService.getMovieById
);

//GET MOVIE
router.get(
  "/movies",
  movieService.getMovie
);

//CREATE MOVIE BY ADMIN
router.post(
  "/movies",
  //validateCreateMovie,
  passport.authenticate("jwt", { session: false }),
  authorizing(["admin"]),
  movieService.createMovie
);

//UPDATE MOVIE BY ADMIN
router.put(
  "/movies/:movieId",
  //validateUpdateMovie,
  passport.authenticate("jwt", { session: false }),
  authorizing(["admin"]),
  movieService.updateMovie
);

//DELETE MOVIE BY ADMIN
router.delete(
  "/movies/:movieId",
  passport.authenticate("jwt", { session: false }),
  authorizing(["admin"]),
  movieService.deleteMovie
);

module.exports = router;
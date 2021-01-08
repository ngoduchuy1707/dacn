const express = require("express");
const router = express.Router();
const passport = require("passport");

const { authorizing } = require("../middlewares/auth/index");
const cinemaService = require("../services/cinema.servive");

//GET CINEMA
router.get(
  "/cinemas",
  cinemaService.getCinema
);

//GET CINEMA BY ID
router.get(
  "/cinemas/:cinemaId",
  cinemaService.getCinemaById
);

//CREATE CINEMA BY ADMIN
router.post(
  "/cinemas",
  passport.authenticate("jwt", { session: false }),
  authorizing(["admin"]),
  cinemaService.createCinema
);

//UPDATE CINEMA BY ADMIN
router.put(
  "/cinemas/:cinemaId",
  passport.authenticate("jwt", { session: false }),
  authorizing(["admin"]),
  cinemaService.updateCinema
);

//DELETE CINEMA BY ADMIN
router.delete(
  "/cinemas/:cinemaId",
  passport.authenticate("jwt", { session: false }),
  authorizing(["admin"]),
  cinemaService.deleteCinema
);

//SEARCH MOVIE
router.post(
  "/cinemas/search-movie",
  cinemaService.searchMovie
);

module.exports = router;
const express = require("express");
const router = express.Router();
const passport = require("passport");
const { validateCreateTheaters } = require("../middlewares/validation/theaters/create-theaters.validation");
const { validationUpdateTheaters } = require("../middlewares/validation/theaters/update-theaters.validation");
const { authorizing } = require("../middlewares/auth/index");
const theatersService = require("../services/theaters.service");

//GET THEATERS BY CINEMA
router.get(
    "/theaters/cinema",
    theatersService.getTheatersByCinema
);

//GET THEATERS BY ID
router.get(
    "/theaters/:theatersId",
    theatersService.getTheatersById
);

//GET THEATERS
router.get(
    "/theaters",
    theatersService.getTheaters
);

//CREATE THEATERS BY ADMIN
router.post(
    "/theaters",
    //validateCreateTheaters,
    passport.authenticate("jwt", { session: false }),
    authorizing(["admin"]),
    theatersService.createTheaters
);

//UPDATE THEATERS BY ADMIN
router.put(
    "/theaters/:theatersId",
    //validationUpdateTheaters,
    passport.authenticate("jwt", { session: false }),
    authorizing(["admin"]),
    theatersService.updateTheaters
);

//DELETE THEATERS BY ADMIN
router.delete(
    "/theaters/:theatersId",
    passport.authenticate("jwt", { session: false }),
    authorizing(["admin"]),
    theatersService.deleteTheaters
);

module.exports = router;
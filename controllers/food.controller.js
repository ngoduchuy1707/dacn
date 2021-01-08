const express = require("express");
const router = express.Router();
const passport = require("passport");

const { authorizing } = require("../middlewares/auth/index");
const foodService = require("../services/food.service");

//GET FOOD BY ID
router.get(
  "/foods/:foodId",
  foodService.getFoodById
);

//GET FOOD
router.get(
  "/foods",
  foodService.getFood
);

//CREATE FOOD BY ADMIN
router.post(
  "/foods",
  passport.authenticate("jwt", { session: false }),
  authorizing(["admin"]),
  //validateCreateMovie,
  foodService.createFood
);

//UPDATE FOOD BY ADMIN
router.put(
  "/foods/:foodId",
  passport.authenticate("jwt", { session: false }),
  authorizing(["admin"]),
  //validateCreateMovie,
  foodService.updateFood
);

//DELETE FOOD BY ADMIN
router.delete(
  "/foods/:foodId",
  passport.authenticate("jwt", { session: false }),
  authorizing(["admin"]),
  foodService.deleteFood
);

module.exports = router;
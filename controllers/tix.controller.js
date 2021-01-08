// const express = require("express");
// const router = express.Router();
// const passport = require("passport");

// const { authorizing } = require("../middlewares/auth/index");
// const tixService = require("../services/tix.service");

// //GET TIX BY ID
// router.get(
//     "/tix/:tixId",
//     tixService.getTixById
// );

// //GET TIX
// router.get(
//     "/tix",
//     tixService.getTix
// );

// //CREATE TIX BY ADMIN
// router.post(
//     "/tix",
//     passport.authenticate("jwt", { session: false }),
//     authorizing(["admin"]),
//     tixService.createTix
// );

// //UPDATE TIX BY ADMIN
// router.put(
//     "/tix/:tixId",
//     passport.authenticate("jwt", { session: false }),
//     authorizing(["admin"]),
//     tixService.updateTix
// );

// //DELETE TIX BY ADMIN
// router.delete(
//     "/tix/:tixId",
//     passport.authenticate("jwt", { session: false }),
//     authorizing(["admin"]),
//     tixService.deleteTix
// );

// module.exports = router;
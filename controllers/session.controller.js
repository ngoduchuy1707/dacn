const express = require("express");
const router = express.Router();
const passport = require("passport");
//const {validationCreatesession}=require("../middlewares/validation/")
const { authorizing } = require("../middlewares/auth/index");
const sessionService = require("../services/session.service");



//GET SESSION BY ID
router.get(
    "/sessions/:sessionId",
    sessionService.getSessionById
);

//GET SESSION BY MOVIE ID
router.get(
    "/sessions/movie/:movieId",
    sessionService.getSessionByMovieId
)
//GET SESSION
router.get(
    "/sessions",
    sessionService.getSession
);

//CREATE SESSION BY ADMIN
router.post(
    "/sessions",
    passport.authenticate("jwt", { session: false }),
    authorizing(["admin"]),
    sessionService.createSession
);

//UPDATE SESSION BY ADMIN
router.put(
    "/sessions/:sessionId",
    passport.authenticate("jwt", { session: false }),
    authorizing(["admin"]),
    sessionService.updateSession
);

//DELETE SESSION BY ADMIN
router.delete(
    "/sessions/:sessionId",
    passport.authenticate("jwt", { session: false }),
    authorizing(["admin"]),
    sessionService.deleteSession
);

module.exports = router;
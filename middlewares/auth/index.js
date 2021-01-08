const jwt = require("express-jwt");
const mongoose = require("mongoose");
const errorResult = require("../../config/errors/errorResult");
const { authorize } = require("passport");

module.exports.authorizing = (userTypeArray) => {
  return (req, res, next) => {
    const user = req.user;
    if (userTypeArray.indexOf(user.userType) > -1 ) return next();
    res.json({
      message: errorResult.forbidden
    })
  }
}

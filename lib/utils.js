const util = require("util")
const jwt = require("jsonwebtoken")
const jwtSign = util.promisify(jwt.sign)
const configKey = require("../config/config-key")

function issueJWT(user) {

  const payload = {
    _id: user._id,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone,
    userType: user.userType,
    dateOfBirth: user.dateOfBirth,
    address: user.address,
    gender: user.gender
  }
  return jwtSign(
    payload,
    configKey.SECRET_KEY,
    { expiresIn: configKey.TokenLife }
  )
}

function issue_JWT(admin) {

  const payload = {
    _id: admin._id,
    email: admin.email,
    fullName: admin.fullName,
    userType: admin.userType
  }
  return jwtSign(
    payload,
    configKey.SECRET_KEY,
    { expiresIn: configKey.TokenLife }
  )
}

module.exports = {
  issueJWT,
  issue_JWT
};
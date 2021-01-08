const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: false
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "other"]
  },
  userType: {
    type: String,
    default: "member"
  },
  status: {
    type: String,
    default: "active"
  },
  avatarUrl: {
    type: String
  },
  resetPasswordToken: {
    type: String,
    default: undefined
  },
  resetPasswordExpires: {
    type: String,
    default: undefined
  }
});

UserSchema.statics.doesntExist = function (options) {
  return this.where(options).countDocuments() === 0
}
UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  bcrypt.genSalt(10)
    .then(salt => {
      return bcrypt.hash(user.password, salt)
    })
    .then(hash => {
      user.password = hash
      next()
    })
});

const User = mongoose.model("User", UserSchema, "User");

module.exports = {
  UserSchema, User
}
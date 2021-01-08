const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: { type: String, required: true },
  fullName: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    default: "admin",
  },
  avatarUrl: { type: String },
});

adminSchema.statics.doesntExist = function (options) {
  return this.where(options).countDocuments() === 0;
};
adminSchema.pre("save", function (next) {
  const admin = this;
  if (!admin.isModified("password")) return next();

  bcrypt
    .genSalt(10)
    .then((salt) => {
      return bcrypt.hash(admin.password, salt);
    })
    .then((hash) => {
      admin.password = hash;
      next();
    });
});

const Admin = mongoose.model("admin", adminSchema, "admin");

module.exports = {
  adminSchema,
  Admin,
};

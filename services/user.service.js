const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const { User } = require("../models/user.model");
const utils = require("../lib/utils");
const errorResult = require("../config/errors/errorResult");
const configKey = require("../config/config-key");
const { authorizing } = require("../middlewares/auth");
const {
  authSchema,
} = require("../middlewares/validation/user/create-user.validation");

//GET USER
// module.exports.getUser = async (req, res, next) => {
//   try {
//     const user = await User.find()
//       .select("-password");
//     if (!user) {
//       throw {
//         error: errorResult.badRequest
//       }
//     } else {
//       const count=user
//       return res.json({
//         message: errorResult.success,
//         status: "Active",
//         total_page:,
//         data: user
//       });
//     }
//   } catch (error) {
//     return res.json(error);
//   }
// }

module.exports.getUser = async (req, res, next) => {
  try {
    const [user, count] = await Promise.all([
      User.find().select("-password"),
      User.countDocuments({ userType: "member" }),
    ]);
    if (!user) {
      throw {
        error: errorResult.badRequest,
      };
    }
    if (user.length < 1) {
      throw {
        error: null,
      };
    } else {
      return res.json({
        message: errorResult.success,
        total_page: count,
        data: user,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//GET USER BY ID
module.exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: user,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//REGISTER USER
module.exports.createUser = async (req, res, next) => {
  try {
    const {
      email,
      password,
      confirmPassword,
      fullName,
      phone,
      dateOfBirth,
      address,
      gender,
    } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw {
        error: errorResult.badRequest,
      };
    }
    const token = jwt.sign(
      {
        email,
        password,
        confirmPassword,
        fullName,
        phone,
        dateOfBirth,
        address,
        gender,
      },
      configKey.SECRET_KEY,
      {
        expiresIn: "10m",
      }
    );
    const transport = {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      requireSSL: true,
      auth: {
        user: configKey.USER,
        pass: configKey.PASSWORD,
      },
    };
    const transporter = nodemailer.createTransport(transport);
    const mailOptions = {
      from: configKey.USER,
      to: email,
      subject: "Account Activation Link",
      html: `<p>Hi,<br>Please confirm your email address by clicking on the link below. We"ll communicate with you from time to time via email so it"s important that we have an up-to-date email address on file.</p>
     <b> ${token} </b>`,
    };
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        return console.log(err);
      }
      return res.json({
        message: "Please check your email",
      });
    });
  } catch (error) {
    return res.json(error);
  }
};

//VERIFY EMAIL
module.exports.activateAccount = async (req, res) => {
  try {
    const { code } = req.body;
    if (code) {
      jwt.verify(code, configKey.SECRET_KEY, function (err, decoded) {
        console.log("err veiry", err);
        if (err) {
          throw { error: err };
        } else {
          const {
            email,
            password,
            confirmPassword,
            fullName,
            phone,
            dateOfBirth,
            address,
            gender,
          } = decoded;
          let newUser = new User({
            email,
            password,
            fullName,
            phone,
            dateOfBirth,
            address,
            gender,
          });
          newUser.save((err, user) => {
            if (err) {
              console.log(("error new user", err));
              throw {
                error: errorResult.badRequest,
              };
            } else {
              return res.json({
                message: errorResult.success,
                data: user,
              });
            }
          });
        }
      });
    } else {
      throw {
        error: errorResult.badRequest,
      };
    }
  } catch (error) {
    return res.json(error);
  }
};

//LOGIN
module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let _user;
  try {
    const user = await User.findOne({ email }).select('-password');
    if (!user) {
      throw {
        error: errorResult.notFound,
      };
    }
    _user = user;
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      throw {
        error: errorResult.badRequest,
      };
    }
    const token = await utils.issueJWT(_user);
    return res.json({
      message: errorResult.success,
      token,
      data: _user,
    });
  } catch (error) {
    return res.json(error);
  }
};

//UPDATE PASSWORD
module.exports.updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    let _user;
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      throw {
        error: errorResult.notFound,
      };
    }
    _user = user;
    const isMatched = await bcrypt.compare(oldPassword, user.password);
    if (!isMatched) {
      throw {
        error: errorResult.badRequest,
      };
    } else {
      _user.password = newPassword;
      _user.save();
      return res.json({
        message: errorResult.success,
        data: _user,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//GET USER INFO BY TOKEN
module.exports.getUserInfo = (req, res, next) => {
  return res.json({
    message: errorResult.success,
    data: req.user,
  });
};

//UPLOAD AVATAR
module.exports.uploadAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select(
      "email fullName userType _id avatarUrl phone address dateOfBirth"
    );
    if (!user) {
      throw {
        error: errorResult.notFound,
      };
    }
    user.avatarUrl = `${req.file.fieldname}s/${req.file.filename}`;
    user.save();
    return res.json({
      message: errorResult.success,
      data: user,
    });
  } catch (error) {
    return res.json(error);
  }
};

//UPDATE USER INFO
module.exports.updateUserInfo = async (req, res, next) => {
  try {
    const { phone, address, dateOfBirth, fullName } = req.body;
    const user = await User.findByIdAndUpdate(
      { _id: req.user._id },
      { phone, address, dateOfBirth, fullName },
      { new: true }
    );
    if (!user) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: user,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//SEARCH USER
module.exports.getUserByName = async (req, res, next) => {
  try {
    const name = req.query.fullName;
    const regex = new RegExp(name, "i");
    const user = await User.find({ fullName: regex });
    if (name === "" || user.length < 1 || name === null) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: user,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//SUCCESS REDIRECT
// module.exports.successRedirect = (req, res) => {
//   return res.json({ message: "You are a valid user" })
// }

//FAILURE REDIRECT
// module.exports.failureRedirect = (req, res) => {
//   return res.json({ message: "You are not a valid user" })
// }

//DELETE USER
module.exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    let _user;
    const user = await User.findById(userId);
    if (!user) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      _user = user;
      user.deleteOne();
      return res.json({
        message: errorResult.success,
        data: _user,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//CREATE TOKEN RESET
module.exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    console.log("user find", user);
    if (user.length < 1 || !user) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      const buffer = await crypto.randomBytes(20);
      if (!buffer) {
        throw {
          error: errorResult.badRequest,
        };
      }
      const token = buffer.toString("hex");
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000;
      user.save();
      const transport = {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        requireSSL: true,
        auth: {
          user: configKey.USER,
          pass: configKey.PASSWORD,
        },
      };
      const transporter = nodemailer.createTransport(transport);
      const mailOptions = {
        from: configKey.USER,
        to: email,
        subject: "Reset Password Link",
        html: `<p>Hi,<br>Please confirm your email address by clicking on the link below. We"ll communicate with you from time to time via email so it"s important that we have an up-to-date email address on file.</p>
        Reset password code is: <b>${token}</b>`,
      };
      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          return console.log(err);
        }
        return res.json({
          message: "Success! Please check your email.",
        });
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//GET TOKEN RESET
module.exports.getTokenReset = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("-password");
    if (!user) {
      throw {
        error: errorResult.notFound,
      };
    }
    return res.json({
      message: errorResult.success,
      data: user,
    });
  } catch (error) {
    return res.json(error);
  }
};

//RESET PASSWORD
module.exports.resetPassword = async (req, res, next) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const { token } = req.params;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      throw {
        error: errorResult.notFound,
      };
    }
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.save();
    const transport = {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      requireSSL: true,
      auth: {
        user: configKey.USER,
        pass: configKey.PASSWORD,
      },
    };
    const transporter = nodemailer.createTransport(transport);
    const mailOptions = {
      from: configKey.USER,
      to: user.email,
      subject: "Your password has been changed",
      html: `<p>Hi,<br>This is a confirmation that the password for your account ${user.email} has just been changed.\n</p>
      New Password is: <b>${newPassword}</b>`,
    };
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        return console.log(err);
      }
      return res.json({
        message: "Success! Your password has been changed.",
      });
    });
  } catch (error) {
    return res.json(error);
  }
};

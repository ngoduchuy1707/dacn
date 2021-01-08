const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const errorResult = require("../config/errors/errorResult");
const utils = require("../lib/utils");
const { authorizing } = require("../middlewares/auth");
const { Admin } = require("../models/admin.model");

//GET ADMIN
module.exports.getAdmin = async (req, res, next) => {
  try {
    const [admin, count] = await Promise.all([
      Admin.find().select("-password"),
      Admin.count(),
    ]);

    if (!admin) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: admin,
        total_page: count,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};
//REGISTER ADMIN
module.exports.createAdmin = async (req, res, next) => {
  try {
    const { email, password, confirmPassword, fullName } = req.body;
    const admin = await Admin.findOne({ email });
    if (admin) {
      throw {
        error: errorResult.badRequest,
      };
    }
    let newAdmin = new Admin({ email, password, confirmPassword, fullName });
    newAdmin.save((err, result) => {
      if (err) {
        throw {
          error: errorResult.badRequest,
        };
      } else {
        return res.json({
          message: errorResult.success,
          data: result,
        });
      }
    });
  } catch (error) {
    return res.json(error);
  }
};
//GET ADMIN BY ID
module.exports.getAdminById = async (req, res, next) => {
  try {
    const { adminId } = req.params;
    const admin = await Admin.findById(adminId);
    if (!admin) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: result,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//DELETE ADMIN
module.exports.deleteAdmin = async (req, res, next) => {
  try {
    const { adminId } = req.params;
    let _admin;
    const admin = await Admin.findById(adminId);
    if (!admin) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      _admin = admin;
      admin.deleteOne();
      return res.json({
        message: errorResult.success,
        data: _admin,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//LOGIN
module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let _admin;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin || admin.userType !== "admin") {
      throw {
        error: errorResult.unauthorized,
      };
    }
    _admin = admin;
    const isMatched = await bcrypt.compare(password, admin.password);
    if (!isMatched) {
      throw {
        error: errorResult.badRequest,
      };
    } else {
      const token = await utils.issue_JWT(_admin);
      return res.json({
        message: errorResult.success,
        token,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//UPDATE ADMIN INFO
module.exports.updateAdminInfo = async (req, res, next) => {
  try {
    const admin = await Admin.findByIdAndUpdate(
      { _id: req.user._id },
      { fullName, userType },
      { new: true }
    );
    if (!admin) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: admin,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

const express = require("express");
const router = express.Router();
const passport = require("passport");

const { authorizing } = require("../middlewares/auth/index");
const { validateCreateAdmin } = require("../middlewares/validation/admin/create-admin.validation");
const { validateUpdatePassword } = require("../middlewares/validation/user/update-password.validation");
const { validateUpdateFullname } = require("../middlewares/validation/user/update-fullName.validation");
const adminService = require("../services/admin.service");

//GET ADMIN
router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    authorizing(["admin"]),
    adminService.getAdmin
);

//GET ADMIN BY ID
router.get(
    "/:adminId",
    passport.authenticate("jwt", { session: false }),
    authorizing(["admin"]),
    adminService.getAdminById
);

//REGISTER
router.post(
    "/register-admin",
    //validateCreateAdmin,
    adminService.createAdmin
);

//LOGIN
router.post(
    "/login",
    adminService.login
);

//UPDATE ADMIN INFO
router.put(
    "/update-adminInfo",
    //validateUpdateFullname,
    passport.authenticate("jwt", { session: false }),
    authorizing(["admin"]),
    adminService.updateAdminInfo
);

//DELETE ADMIN
router.delete(
    "/:adminId",
    passport.authenticate("jwt", { session: false }),
    authorizing(["admin"]),
    adminService.deleteAdmin
);

module.exports = router;

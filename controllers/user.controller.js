const express = require("express");
const router = express.Router();
const passport = require("passport");

const { authorizing } = require("../middlewares/auth");
const { uploadImage } = require("../middlewares/images");
const {
  validateCreateUser,
} = require("../middlewares/validation/user/create-user.validation");
const {
  validateUpdateFullname,
} = require("../middlewares/validation/user/update-fullName.validation");
const {
  validateUpdatePassword,
} = require("../middlewares/validation/user/update-password.validation");
const utils = require("../lib/utils");
const userService = require("../services/user.service");

//GET USER INFO
router.get(
  "/userInfo",
  passport.authenticate("jwt", { session: false }),
  userService.getUserInfo
);

//UPDATE USESR INFO
router.put(
  "/update-userInfo",
  //validateUpdateFullname,
  passport.authenticate("jwt", { session: false }),
  authorizing(["member", "admin"]),
  userService.updateUserInfo
);

//GET USER
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorizing(["admin"]),
  userService.getUser
);

//GET USER BY ID
router.get("/:userId", userService.getUserById);

//REGISTER USER
router.post(
  "/register",
  validateCreateUser,
  userService.createUser
);

//ACTIVE EMAIL
router.post("/activate", userService.activateAccount);

//LOGIN
router.post("/login", userService.login);

//UPDATE PASSWORD
router.patch(
  "/update-password",
  //validateUpdatePassword,
  passport.authenticate("jwt", { session: false }),
  authorizing(["member"]),
  userService.updatePassword
);

//UPLOAD AVATAR
router.post(
  "/upload-avatar",
  passport.authenticate("jwt", { session: false }),
  authorizing(["member"]),
  uploadImage("avatar"),
  userService.uploadAvatar
);

//GET USER BY NAME
router.get("/search/user", userService.getUserByName);

//DELETE USER BY ADMIN
router.delete(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  authorizing(["admin"]),
  userService.deleteUser
);

//FORGOT PASSWORD
router.post("/forgot", userService.forgotPassword);

//RESET PASSWORD
router.post("/reset/:token", userService.resetPassword);

//GET TOKEN RESET
router.get("/getTokenReset/:token", userService.getTokenReset);

//LOGIN FACEBOOK
// router.get("/auth/facebook",
//   passport.authenticate('facebook',
//     { scope: ['user_friends', 'manage_pages'] })
// )

// router.get("/facebook/callback", passport.authenticate('facebook', {
//   successRedirect: '/profile',
//   failureRedirect: '/failed'
// }))

// router.get("/profile", userService.successRedirect)

// router.get("/failed", userService.failureRedirect)

module.exports = router;

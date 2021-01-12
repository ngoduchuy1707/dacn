const express = require("express");
const router = express.Router();
const passport = require("passport");

const { authorizing } = require("../middlewares/auth/index");
const billService = require("../services/bill.service");

//GET STATUS === WAITING
router.get(
    "/bills/status",
    billService.getStatusWaiting
);

//GET STATUS === SUCCESS
router.get(
    "/bills/status",
    billService.getStatusSuccess
);

//GET BILL
router.get(
    "/bills",
    billService.getBill
);

//GET MOVIE BY ID
router.get(
    "/bills/:billId",
    billService.getBillById
);

//DELETE BILL
router.delete(
    "/bills/:billId",
    passport.authenticate("jwt", { session: false }),
    authorizing(["member"]),
    billService.deleteBill
);

module.exports = router;
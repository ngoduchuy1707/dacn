const express = require("express");
const router = express.Router();
const payService = require("../services/pay.service");

router.post(
    "/create-payment/:ticketId",
    payService.createPayment
);

router.get(
    "/list",
    payService.getPaymentList
);

router.get(
    "/vnpay_return",
    payService.getPaymentReturn
);

router.get(
    "/vnpay_ipn",
    payService.getPayment
);

module.exports = router;
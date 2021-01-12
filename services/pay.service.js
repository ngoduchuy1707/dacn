const dateFormat = require("dateformat");
const querystring = require("qs");
const sha256 = require("sha256");
const mongoose = require("mongoose");

const configKey = require("../config/config-key");
const errorResult = require("../config/errors/errorResult");
const router = require("../controllers/session.controller");
const { Ticket } = require("../models/ticket.model");
const { Seat } = require("../models/seat.model");
const { Payment } = require("../models/pay.model");
const { Theaters } = require("../models/theaters.model");
const { mongo } = require("mongoose");
const { session } = require("passport");
const { Bill } = require("../models/bill.model");

const tmnCode = configKey.CLIENT_ID;
const secretKey = configKey.CLIENT_SECRET;
const returnUrl = configKey.returnUrl;
let vnpUrl = configKey.vnp_Url;

module.exports.getPaymentList = async (req, res, next) => {
  try {
    const payList = await Payment.find();
    if (!payList || payList.length < 1) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: payList,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports.createPayment = async (req, res, next) => {
  try {
    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    //const ipAddr = "42.119.157.83";
    const amount = req.body.amount;
    const bankCode = req.body.bankCode;
    const orderInfo = req.body.orderDescription;
    const orderType = req.body.orderType;
    const date = new Date();
    const createDate = dateFormat(date, "yyyymmddHHmmss");
    const orderId = dateFormat(date, "HHmmss");
    let locale = "vn";
    const currCode = "VND";
    let vnp_Params = {};
    vnp_Params = {};
    vnp_Params["vnp_Version"] = "2";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = orderInfo;
    vnp_Params["vnp_OrderType"] = orderType;
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    vnp_Params["vnp_BankCode"] = bankCode;
    //console.log('vnpParams',vnp_Params)
    vnp_Params = sortObject(vnp_Params);
    var signData =
      secretKey + querystring.stringify(vnp_Params, { encode: false });

    var secureHash = sha256(signData);

    vnp_Params["vnp_SecureHashType"] = "SHA256";
    vnp_Params["vnp_SecureHash"] = secureHash;
    vnpUrl = '';
    vnpUrl = 'http://sandbox.vnpayment.vn/paymentv2/vpcpay.html?' + querystring.stringify(vnp_Params, { encode: true })
    function sortObject(o) {
      var sorted = {},
        key,
        a = [];

      for (key in o) {
        if (o.hasOwnProperty(key)) {
          a.push(key);
        }
      }

      a.sort();

      for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
      }
      return sorted;
    }
    return res.status(200).json({ code: "00", data: vnpUrl });


  } catch (error) {
    return res.json(error)
  }
};

module.exports.getPayment = async (req, res, next) => {
  try {

    let vnp_Params = req.query;
    var secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);
    var signData =
      secretKey + querystring.stringify(vnp_Params, { encode: false });
    var checkSum = sha256(signData);
    function sortObject(o) {
      let sorted = {},
        key,
        a = [];

      for (key in o) {
        if (o.hasOwnProperty(key)) {
          a.push(key);
        }
      }

      a.sort();

      for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
      }
      return sorted;
    }
    if (secureHash === checkSum) {
      var orderId = vnp_Params["vnp_TxnRef"];
      var rspCode = vnp_Params["vnp_ResponseCode"];
      const [bill, ticket] = await Promise.all([
        Bill.create({
          amount: vnp_Params.vnp_Amount,
          transactionsId: vnp_Params.vnp_TxnRef,
          bankCode: vnp_Params.vnp_BankCode,
          ticket_id: vnp_Params.vnp_OrderInfo
        }),
        Ticket.findOneAndUpdate({ _id: vnp_Params.vnp_OrderInfo }, { status: 'success' }, { new: true }),
      ])
      return res.status(200).json({
        RspCode: "00",
        Message: "success",
        data: bill,
        ticket: ticket
      });

    } else {
      return res.status(200).json({
        RspCode: "97",
        Message: "Fail checksum",
      });
    }

  } catch (error) {
    next(error);
  }
};

module.exports.getPaymentReturn = async (req, res, next) => {
  try {
    var vnp_Params = req.query;
    var secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];
    function sortObject(o) {
      let sorted = {},
        key,
        a = [];

      for (key in o) {
        if (o.hasOwnProperty(key)) {
          a.push(key);
        }
      }

      a.sort();

      for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
      }
      return sorted;
    }
    vnp_Params = sortObject(vnp_Params);

    var signData =
      secretKey + querystring.stringify(vnp_Params, { encode: false });

    var checkSum = sha256(signData);
    console.log("ressponse", vnp_Params);
    if (secureHash !== checkSum) {
      throw {
        error: "Transaction failed",
      };
    }
    return res.json({
      message: errorResult.success,
      data: vnp_Params["vnp_TmnCode"],
    });
  } catch (error) {
    return res.json(error);
  }
};

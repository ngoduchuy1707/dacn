const { mongo } = require("mongoose");
const errorResult = require("../config/errors/errorResult");
const { Cinema } = require("../models/cinema.model");
const { Movie } = require("../models/movie.model");
const { Theaters } = require("../models/theaters.model");
const { Ticket } = require("../models/ticket.model");
const { Bill } = require("../models/bill.model");

//GET BILL
module.exports.getBill = async (req, res, next) => {
  try {
    const [bill, count] = await Promise.all([
      Bill.find().populate({ path: 'ticket_id' }),
      Bill.countDocuments()
    ])

    if (!bill) {
      throw { error: errorResult.badRequest };
    } else {
      return res.json({
        message: errorResult.success,
        data: bill,
        total_page: count
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//GET BILL BY ID
module.exports.getBillById = async (req, res, next) => {
  try {
    const { billId } = req.params;
    const bill = await Bill.findById(billId);
    if (!bill) {
      throw { error: errorResult.notFound };
    } else {
      return res.json({
        message: errorResult.success,
        data: bill,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//GET BILL STATUS === WAITING
module.exports.getStatusWaiting = async (req, res, next) => {
  try {
    const regex = new RegExp(req.query.status, "i");
    const statusBill = await Bill.find({ status: regex });
    if (statusBill !== "Waiting") {
      throw { error: errorResult.notFound };
    } else {
      return res.json({
        message: errorResult.success,
        data: statusBill,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//GET BILL STATUS === SUCCESS
module.exports.getStatusSuccess = async (req, res, next) => {
  try {
    const regex = new RegExp(req.query.status, "i");
    const statusBill = await Bill.find({ status: regex });
    if (statusBill !== "success") {
      throw { error: errorResult.notFound };
    } else {
      return res.json({
        message: errorResult.success,
        data: statusBill,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//DELETE BILL
module.exports.deleteBill = async (req, res, next) => {
  try {
    const { billId } = req.params;
    const bill = await Bill.findById(billId);
    let _bill;
    if (!bill) {
      throw { error: errorResult.notFound };
    } else {
      _bill = bill;
      bill.deleteOne();
    }
    return res.json({
      message: errorResult.success,
      data: _bill,
    });
  } catch (error) {
    return res.json(error);
  }
};

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
    const bill = await Bill.find();
    if (!bill) {
      throw { error: errorResult.badRequest };
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
    if (statusBill !== "Success") {
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

//CREATE BILL
module.exports.createBill = async (req, res, next) => {
  // const client = await mongo.connect("mongodb+srv://Vexere:6E676F647563687579@cluster0.g74ap.mongodb.net/fs10-Vexere?retryWrites=true&w=majority",
  //     {
  //         useNewUrlParser: true,
  //         useUnifiedTopology: true
  //     })
  // const session = client.startTransaction()
  // session.startTransaction()
  // const transactionOptions = {
  //     readPreference: "primary",
  //     readConcern: { level: "local" },
  //     writeConcern: { w: "majority" }
  // };
  // try {
  //     const { cinemaId, userId, movieId, theatersId, ticketId } = req.body
  //     const bill = await Bill.create({
  //         cinemaId, userId, movieId, theatersId, ticketId
  //     })
  //     await session.withTransaction(async () => {
  //         const coll1 = client.db("fs10-Vexere").collection("Bill");
  //         await coll1.insertOne(
  //             { cinema_id: cinemaId },
  //             { user_id: userId },
  //             { movie_id: movieId },
  //             { theaters_id: theatersId },
  //             { ticket_id: ticketId },
  //             { session }
  //         );
  //         return res.json({
  //             message: errorResult.success,
  //             data: bill
  //         })
  //     }, transactionOptions);
  // } catch (error) {
  //     return res.json(error)
  // } finally {
  //     await session.endSession();
  //     await client.close();
  // }
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

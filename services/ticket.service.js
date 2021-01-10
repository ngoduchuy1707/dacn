const mongoose = require("mongoose");
const errorResult = require("../config/errors/errorResult");
const handleDate = require("../function/handle-date");
const { User } = require("../models/user.model");
const { Theaters } = require("../models/theaters.model");
const { Ticket } = require("../models/ticket.model");
const { Session } = require("../models/session.model");
const { Movie } = require("../models/movie.model");
const { Cinema } = require("../models/cinema.model");
const { Food } = require("../models/food.model");

//GET TICKET
module.exports.getTicket = async (req, res, next) => {
  try {
    const [ticket, count] = await Promise.all([
      Ticket.find().populate({ path: 'user_id foodId', select: 'email fullName food_Name' }),
      Ticket.countDocuments(),
    ])

    if (!ticket) {
      throw {
        error: "Ticket Empty",
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: ticket,
        total_page: count
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//GET TICKET BY ID
module.exports.getTicketId = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findById(ticketId).populate({ path: 'user_id foodId', select: 'email fullName food_Name' });
    if (!ticket) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: ticket,
        total_page: count
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//GET TICKET BY USER ID
module.exports.getTicketUserId = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const [ticket, count] = await Promise.all([
      Ticket.find({ user_id: userId }).populate({ path: 'user_id', select: 'email fullName' }),
      Ticket.countDocuments()
    ])

    if (!ticket) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: ticket,
        total_record: count
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

//DELETE TICKET
module.exports.deleteTicket = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    let _ticket;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw { error: errorResult.notFound };
    } else {
      _ticket = ticket;
      ticket.deleteOne();
      return res.json({
        message: errorResult.success,
        data: _ticket,
      });
    }
  } catch (error) {
    res.json(error);
  }
};

//CREATE BOOK TICKET
module.exports.bookTicket = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      sessionId,
      foodId,
      seatCodes,
      quantityFood,
      totalPrice
    } = req.body;
    const session = await Session.findOne({ _id: sessionId }).populate('cinema_id movie_id theaters_id');
    //khong tim thay suat chieu
    if (
      !session ||
      (session && session.length < 1)
    ) {
      throw {
        error: "session not found",
      };
    }
    const theaters = await Theaters.findOne({ _id: session.theaters_id });
    seatCodes.forEach((code) => {
      const index = theaters.seats.findIndex((seat) => seat.code === code);
      theaters.seats[index].isBooked = 1;
    });
    theaters.save();


    const result = await Ticket.create({
      user_id: userId,
      session,
      foodId,
      quantityFood,
      totalPrice,
      seats: seatCodes
    })
    return res.json({
      message: errorResult.success,
      data: result,
    });
  } catch (error) {
    return res.json(error);
  }
};

// UPDATE STATUS
module.exports.updateStatus = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw {
        error: errorResult.notFound
      }
    } else {
      ticket.status = 'success';
      ticket.save();
      return res.json({
        message: errorResult.success,
        data: ticket
      })
    }
  } catch (error) {
    return res.json(error)
  }
}
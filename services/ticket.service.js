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
//const { Tix } = require("../models/tix.model");

//GET TICKET
module.exports.getTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.find();
    if (!ticket) {
      throw {
        error: "Ticket Empty",
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: ticket,
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
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw {
        error: errorResult.notFound,
      };
    } else {
      return res.json({
        message: errorResult.success,
        data: ticket,
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

//BOOK TICKET
module.exports.bookTicket = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      movieId,
      cinemaId,
      date,
      theatersId,
      price,
      foodId,
      seatCodes,
      tixQuantity,
      foodQuantity,
    } = req.body;
    const session = await Session.find({
      //tim suat chieu
      movie_id: movieId,
      theaters_id: theatersId,
      cinema_id: cinemaId,
      date: date,
    });
    //khong tim thay suat chieu hoac khong tim thay loai ghe
    if (
      !session ||
      (session && (session.length < 1 || session.price !== price))
    ) {
      throw {
        error: errorResult.notFound,
      };
    }
    const theaters = await Theaters.findById(session.theaters_id);
    const availableSeatCodes = theaters.seats
      .filter((seat) => seat.isBooked === 0)
      .map((seat) => seat.code);
    const errSeatCodes = [];
    seatCodes.forEach((code) => {
      if (availableSeatCodes.indexOf(code) === -1) {
        errSeatCodes.push(code);
      }
    });
    if (errSeatCodes.length > 0) {
      return Promise.reject({
        status: 404,
        error: `Seat ${errSeatCodes.join(", ")} is/are not available`,
      });
    }
    seatCodes.forEach((code) => {
      const index = theaters.seats.findIndex((seat) => seat.code === code);
      theaters.seats[index].isBooked = 1;
    });
    theaters.save();
    if (foodId === "" || foodId === null) {
      food_Name = "";
      totalPrice = session.price * tixQuantity;
    } else {
      const food = await Food.findById(foodId);
      if (!food || food.quantity < foodQuantity) {
        throw {
          error: errorResult.badRequest,
        };
      } else {
        food_Name = food.food_Name;
        totalPrice =
          session.price * tixQuantity + food.food_Price * foodQuantity;
        food.quantity = food.quantity - foodQuantity;
        food.save();
      }
    }
    const result = await Promise.all([
      Ticket.create({
        userId,
        movieId,
        cinemaId,
        food_Name,
        date,
        totalPrice,
        seats: seat.code,
      }),
      theaters.save(),
    ]);
    return res.json({
      message: errorResult.success,
      data: result,
    });
  } catch (error) {
    return res.json(error);
  }
};

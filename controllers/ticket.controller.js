const express = require('express');
const passport = require("passport");
const router = express.Router();

const { authorizing } = require("../middlewares/auth/index");
const ticketService = require("../services/ticket.service");

//GET TICKET BY USER ID
router.get(
    "/tickets/users",
    passport.authenticate("jwt", { session: false }),
    authorizing(["member"]),
    ticketService.getTicketUserId
)

//GET TICKET BY ID
router.get(
    "/tickets/:ticketId",
    passport.authenticate("jwt", { session: false }),
    authorizing(["admin"]),
    ticketService.getTicketId
);

//UPDATE STATUS
router.put(
    "/tickets/:ticketId",
    ticketService.updateStatus
)
//GET TICKET
router.get(
    "/tickets",
    passport.authenticate("jwt", { session: false }),
    authorizing(["admin"]),
    ticketService.getTicket
);

//CREATE TICKET
router.post(
    "/tickets",
    passport.authenticate("jwt", { session: false }),
    authorizing(["member"]),
    ticketService.bookTicket
);

//DELETE TICKET
router.delete(
    "/tickets/:id",
    passport.authenticate("jwt", { session: false }),
    authorizing(["admin"]),
    ticketService.deleteTicket
);

module.exports = router;
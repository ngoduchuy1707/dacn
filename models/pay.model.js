const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    dfd: {
        type: String
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
});

const Payment = mongoose.model("Payment", paymentSchema, "Payment");

module.exports = {
    paymentSchema, Payment
}


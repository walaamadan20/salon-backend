const { Schema, model, Types } = require("mongoose");

const bookingSchema = new Schema({

    userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  },
  serviceId: {
    type: Types.ObjectId,
    ref: "Services",
    required: true
  },
  staff: { type: String,
         required: true },

  date: { type: Date,
     required: true },

  time: { type: String,
     required: true },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Booking = model("Booking", bookingSchema);

module.exports = Booking;


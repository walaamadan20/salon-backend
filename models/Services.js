const { Schema, model } = require("mongoose");

// Optional time slot schema (with date + time)
const slotSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  timeSlots: [
    {
      from: { type: String, required: true },  // e.g. "10:00"
      to: { type: String, required: true },    // e.g. "11:00"
      isBooked: { type: Boolean, default: false }
    }
  ]
}, { _id: false });

const serviceSchema = new Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true }, // e.g. "30 mins"
  description: { type: String, default: "" },
  isAvailable: { type: Boolean, default: true },

  staff: [{ type: String, trim: true }],  // Array of staff names

  availableDates: [{ type: Date }],       // Optional: simple date list
  schedule: [slotSchema]                  // Optional: full schedule with time slots
});

const Service = model("Service", serviceSchema);

module.exports = Service;

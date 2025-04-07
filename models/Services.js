const { Schema, model } = require("mongoose");

const timeOptions = [
  "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00",
  "17:00", "18:00"
];

const serviceSchema = new Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  description: { type: String, default: "" },
  isAvailable: { type: Boolean, default: true },

  staff: [{ type: String, trim: true }],

  // Schedule: date + one selectable time + booking status
  schedule: [
    {
      date: { type: Date, required: true },
      time: {
        type: String,
        enum: timeOptions,
        required: true
      },
      isBooked: { type: Boolean, default: false }
    }
  ]
});

const Service = model("Service", serviceSchema);

module.exports = Service;

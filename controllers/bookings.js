const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const verifyToken = require("../middleware/verify-token");


router.post('/', async (req, res) => {
  const { userId, serviceId, staff, date, time } = req.body;

  if (!userId || !serviceId || !staff || !date || !time) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const booking = new Booking({ userId, serviceId, staff, date, time });
    await booking.save();

    res.status(201).json({ message: 'Booking created', booking });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get("/",verifyToken ,async (req, res) => {
  try {
    const filter = req.user.isAdmin ? {} : { userId: req.user._id };
    const bookings = await Booking.find(filter).populate("serviceId")
    console.log(bookings)
    res.json(bookings.reverse());
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: err.message });
  }
});

router.get("/:bookingId", verifyToken, async (req, res) => {
  try {
    const foundBookings = await Booking.findOne({
      _id: req.params.bookingId,
      user: req.user._id
    })

    if (!foundBookings) {
      return res.status(404).json({ err: "Booking not found or not yours" });
    }

    res.json(foundBookings);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});



module.exports = router;

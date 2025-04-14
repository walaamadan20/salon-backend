const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

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

module.exports = router;

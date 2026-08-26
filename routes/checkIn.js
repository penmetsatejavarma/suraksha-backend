const express = require('express');
const router = express.Router();
const CheckIn = require('../models/CheckIn');
const protect = require('../middleware/auth');

// Create a check-in
router.post('/add', protect, async (req, res) => {
  try {
    const checkIn = new CheckIn({
      senior: req.user.userId,
      status: req.body.status || 'safe',
      note: req.body.note
    });
    await checkIn.save();
    res.status(201).json({ message: "Check-in recorded!", checkIn });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all check-ins for logged in senior
router.get('/my', protect, async (req, res) => {
  try {
    const checkIns = await CheckIn.find({ senior: req.user.userId })
      .sort({ checkInTime: -1 });
    res.status(200).json(checkIns);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get today's check-in
router.get('/today', protect, async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const checkIn = await CheckIn.findOne({
      senior: req.user.userId,
      checkInTime: { $gte: startOfDay, $lte: endOfDay }
    });

    if (!checkIn) {
      return res.status(404).json({ message: "No check-in found for today" });
    }

    res.status(200).json(checkIn);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const SOS = require('../models/SOS');
const protect = require('../middleware/auth');

// Send SOS alert
router.post('/send', protect, async (req, res) => {
  try {
    const sos = new SOS({
      senior: req.user.userId,
      message: req.body.message,
      location: req.body.location
    });
    await sos.save();
    res.status(201).json({ message: "SOS alert sent!", sos });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all active SOS alerts
router.get('/active', protect, async (req, res) => {
  try {
    const alerts = await SOS.find({ status: 'active' })
      .populate('senior', 'name phone')
      .sort({ createdAt: -1 });
    res.status(200).json(alerts);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Resolve an SOS alert
router.put('/resolve/:id', protect, async (req, res) => {
  try {
    const sos = await SOS.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved', resolvedBy: req.user.userId },
      { new: true }
    );
    if (!sos) {
      return res.status(404).json({ message: "SOS alert not found" });
    }
    res.status(200).json({ message: "SOS resolved!", sos });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
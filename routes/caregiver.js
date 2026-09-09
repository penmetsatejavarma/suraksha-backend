const express = require('express');
const router = express.Router();
const User = require('../models/User');
const protect = require('../middleware/auth');

// Register as caregiver
router.put('/register', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { role: 'caregiver', ...req.body },
      { new: true }
    );
    res.status(200).json({ message: "Registered as caregiver!", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all caregivers
router.get('/all', protect, async (req, res) => {
  try {
    const caregivers = await User.find({ role: 'caregiver' });
    res.status(200).json(caregivers);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get single caregiver by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const caregiver = await User.findOne({ _id: req.params.id, role: 'caregiver' });
    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver not found" });
    }
    res.status(200).json(caregiver);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
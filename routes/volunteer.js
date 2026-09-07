const express = require('express');
const router = express.Router();
const User = require('../models/User');
const protect = require('../middleware/auth');

// Register as volunteer (update own role to volunteer)
router.put('/register', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { role: 'volunteer', ...req.body },
      { new: true }
    );
    res.status(200).json({ message: "Registered as volunteer!", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all volunteers
router.get('/all', protect, async (req, res) => {
  try {
    const volunteers = await User.find({ role: 'volunteer' });
    res.status(200).json(volunteers);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get single volunteer by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const volunteer = await User.findOne({ _id: req.params.id, role: 'volunteer' });
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }
    res.status(200).json(volunteer);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
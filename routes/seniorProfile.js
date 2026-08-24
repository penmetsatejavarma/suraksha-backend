const express = require('express');
const router = express.Router();
const SeniorProfile = require('../models/SeniorProfile');
const protect = require('../middleware/auth');

// Create senior profile
router.post('/create', protect, async (req, res) => {
  try {
    const existing = await SeniorProfile.findOne({ user: req.user.userId });
    if (existing) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const profile = new SeniorProfile({
      user: req.user.userId,
      ...req.body
    });

    await profile.save();
    res.status(201).json({ message: "Profile created!", profile });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get own senior profile
router.get('/me', protect, async (req, res) => {
  try {
    const profile = await SeniorProfile.findOne({ user: req.user.userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update senior profile
router.put('/update', protect, async (req, res) => {
  try {
    const profile = await SeniorProfile.findOneAndUpdate(
      { user: req.user.userId },
      req.body,
      { new: true }
    );
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json({ message: "Profile updated!", profile });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
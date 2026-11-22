const express = require('express');
const router = express.Router();
const User = require('../models/User');
const SeniorProfile = require('../models/SeniorProfile');
const Medicine = require('../models/Medicine');
const CheckIn = require('../models/CheckIn');
const SOS = require('../models/SOS');
const protect = require('../middleware/auth');

router.put('/register', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { role: 'caregiver', name: req.body.name },
      { new: true }
    );
    res.status(200).json({ message: "Registered as caregiver!", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get('/all', protect, async (req, res) => {
  try {
    res.status(200).json(await User.find({ role: 'caregiver' }));
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post('/link', protect, async (req, res) => {
  try {
    const senior = await User.findOne({ phone: req.body.seniorPhone, role: 'senior' });
    if (!senior) return res.status(404).json({ message: "Senior not found" });
    const profile = await SeniorProfile.findOneAndUpdate(
      { user: senior._id },
      { $addToSet: { caregivers: req.user.userId } },
      { new: true }
    );
    if (!profile) return res.status(404).json({ message: "Senior has no profile yet" });
    res.status(200).json({ message: "Linked to senior!", profile });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get('/my-seniors', protect, async (req, res) => {
  try {
    res.status(200).json(await SeniorProfile.find({ caregivers: req.user.userId }));
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get('/senior/:seniorId', protect, async (req, res) => {
  try {
    const profile = await SeniorProfile.findOne({
      user: req.params.seniorId,
      caregivers: req.user.userId
    });
    if (!profile) return res.status(403).json({ message: "You are not linked to this senior" });
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const medicines = await Medicine.find({ senior: req.params.seniorId });
    const todayCheckIn = await CheckIn.findOne({
      senior: req.params.seniorId,
      checkInTime: { $gte: start }
    });
    const activeSOS = await SOS.find({ senior: req.params.seniorId, status: 'active' });
    res.status(200).json({ profile, medicines, todayCheckIn, activeSOS });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const caregiver = await User.findOne({ _id: req.params.id, role: 'caregiver' });
    if (!caregiver) return res.status(404).json({ message: "Caregiver not found" });
    res.status(200).json(caregiver);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
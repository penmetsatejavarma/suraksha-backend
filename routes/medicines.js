const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const protect = require('../middleware/auth');

// Add a medicine
router.post('/add', protect, async (req, res) => {
  try {
    const medicine = new Medicine({
      senior: req.user.userId,
      ...req.body
    });
    await medicine.save();
    res.status(201).json({ message: "Medicine added!", medicine });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all medicines for logged in senior
router.get('/my', protect, async (req, res) => {
  try {
    const medicines = await Medicine.find({ senior: req.user.userId });
    res.status(200).json(medicines);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete a medicine
router.delete('/:id', protect, async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndDelete({
      _id: req.params.id,
      senior: req.user.userId
    });
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    res.status(200).json({ message: "Medicine deleted!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
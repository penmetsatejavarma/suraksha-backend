const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Temporary OTP store (in real apps use Redis or DB)
const otpStore = {};

// Route 1: Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP temporarily (expires in 5 minutes)
    otpStore[phone] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    };

    // In real app you'd send SMS here
    console.log(`OTP for ${phone}: ${otp}`);

    res.json({ message: 'OTP sent successfully', otp }); // Remove otp in production
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP', error });
  }
});

// Route 2: Verify OTP and login
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp, role } = req.body;

    // Check OTP exists
    if (!otpStore[phone]) {
      return res.status(400).json({ message: 'OTP not found. Request a new one.' });
    }

    // Check OTP expired
    if (Date.now() > otpStore[phone].expiresAt) {
      delete otpStore[phone];
      return res.status(400).json({ message: 'OTP expired. Request a new one.' });
    }

    // Check OTP matches
    if (otpStore[phone].otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP is valid - delete it
    delete otpStore[phone];

    // Find or create user
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone, role: role || 'senior', name: 'New User' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP', error });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const HealthFile = require('../models/HealthFile');
const multer = require('multer');
const path = require('path');
const protect = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, Date.now() + '-' + safeName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDFs are allowed!'));
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// Upload a file (saved against the logged-in user)
router.post('/upload', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const record = await HealthFile.create({
      user: req.user.userId,
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size
    });
    res.status(201).json({ message: "File uploaded successfully!", file: record });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get only MY files
router.get('/my', protect, async (req, res) => {
  try {
    const files = await HealthFile.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
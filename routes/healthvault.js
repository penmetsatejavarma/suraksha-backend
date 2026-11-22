const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const protect = require('../middleware/auth');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// File filter - only allow certain file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDFs are allowed!'));
  }
};

const upload = multer({ storage, fileFilter });

// Upload a file
router.post('/upload', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.status(201).json({
      message: "File uploaded successfully!",
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        path: req.file.path
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all files for logged in senior
router.get('/my', protect, async (req, res) => {
  try {
    const fs = require('fs');
    const files = fs.readdirSync('uploads/');
    res.status(200).json({ files });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
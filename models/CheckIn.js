const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema({
  senior: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['safe', 'needs_help'],
    default: 'safe'
  },
  note: { type: String },
  checkInTime: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('CheckIn', checkInSchema);
const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  senior: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  timing: { type: String, required: true },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);
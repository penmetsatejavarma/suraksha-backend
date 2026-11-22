const mongoose = require('mongoose');

const healthFileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalName: String,
  filename: String,
  size: Number
}, { timestamps: true });

module.exports = mongoose.model('HealthFile', healthFileSchema);
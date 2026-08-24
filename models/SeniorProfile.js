const mongoose = require('mongoose');

const seniorProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: { type: String, required: true },
  age: { type: Number },
  address: { type: String },
  emergencyContact: {
    name: { type: String },
    phone: { type: String },
    relation: { type: String }
  },
  medicalConditions: [String],
  bloodGroup: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('SeniorProfile', seniorProfileSchema);
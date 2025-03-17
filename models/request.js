const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  seekerName: {
    type: String,
    required: true,
  },
  seekerContact: {
    type: String,
    required: true,
  },
  neededBloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    required: true,
  },
  hospital: {
    type: String,
    required: true,
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;

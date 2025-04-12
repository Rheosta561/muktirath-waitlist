const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true, 
  },
  image: {
    type: String,
  },
  otp: {
    type: String,
  },
  mobile: {
    type: String,
  },
  dob: {
    type: Date, 
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'], 
  },
  city: {
    type: String,
  },
});

const User = mongoose.model('auth-ads', userSchema);

module.exports = User;

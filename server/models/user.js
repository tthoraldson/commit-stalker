var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  github: {
    type: String,
    trim: true,
    unique: true
  },
  id: {
    type: String,
    required: false,
    trim: true,
    unique: true
  }
});

var User = mongoose.model('User', UserSchema);
module.exports = User;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Commits = require('./commit').schema;

var UserSchema = new Schema({
  name: {
    type: String,
    trim: true,
    unique: false
  },
  admin: {
    type: Boolean,
    required: true,
    trim: true,
    unique: true
  },
  github: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  slackId: {
    type: String,
    required: false,
    trim: true,
    unique: true
  },
  commits: [Commits]
});

var User = mongoose.model('User', UserSchema);
module.exports = User;

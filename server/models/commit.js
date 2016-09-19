var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// subdocument
var commitSchema = new Schema({
  Date: { type: String, required: true},
  Commit_Status: { type: String, required: true }
});

var Commit = mongoose.model('Commit', commitSchema);

module.exports = Commit;

var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  favoriteBook: {
    type: String,
    required: false,
    trim: true
  },
  photo: {
    type: String,
    required: true,
    trim: true
  }
});

UserSchema.statics.findOrCreate = function findOrCreate(profile, cb){
    var userObj = new this();
    this.findOne({_id : profile.id},function(err,result){
        if(!result){
            userObj.username = profile.displayName;
            //....
            userObj.save(cb);
        }else{
            cb(err,result);
        }
    });
};

var User = mongoose.model('User', UserSchema);
module.exports = User;

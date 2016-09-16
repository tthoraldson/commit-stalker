'use strict';

var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require('request');
var Bot = require('slackbots');

/** ---------- ROUTES ----------- **/
var index = require('./routes/index');

/** ------ MODULES ---------- **/
var commits = require('./bot/commits');

/** ---------- MIDDLEWARE ---------- **/
app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.json()); // needed for angular requests
app.use(bodyParser.urlencoded({ extended: true }));

/** ---------- EXPRESS ROUTES ---------- **/
app.use('/', index);

/** ---------- MONGOOSE CONNECTION HANDLING ---------- **/
var databaseUri = 'mongodb://localhost:27017/omicron';

mongoose.connect(databaseUri);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ', databaseUri);
});

mongoose.connection.on('error', function (err) {
  console.log('Mongoose failed to connect because error: ', err);
});
/** ---------- START SERVER ---------- **/
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function () {
  console.log('Slack-bot introduction on: ', app.get('port'));
});


/** -------- SLACK BOT @commit_stalker ------ **/
// global vars
var usernames = [];
var channels = [];

// token for slack bot - session var
var token = (process.env.SLACK_API_TOKEN || '');

// settings for @commit_stalker
var settings = {
    token: token,
    name: 'commit_stalker'
};

// japanese goblin emoji for @commit_stalker photo
var params = {
  icon_emoji: ':japanese_goblin:'
};

// declare @commit_stalker using the settings var
var bot = new Bot(settings);



bot.on('start', function() {
  console.log('Bot is running!');

  // get user IDs and usernames -- get channels
  getTeamUsers();
  getTeamChannels();

  bot.on('message', function(data) {
    // if data from slack is a message
    if(data.text != undefined){

      // if text is directed @commit_stalker
      if(data.text.includes('<@U2B4DPJ68>')){

        var tempMessage = data.text.toLowerCase();
        // find user from usernames array
        var tempUsername = findUsernameById(data.user);

        // if text says hello, hi, or hola
        if (tempMessage.includes('hello') || tempMessage.includes('hola')){
          if (data.type == 'message' && data.username != 'commit_stalker'){

            var tempUserId = data.user;

            bot.postMessageToUser(tempUsername, 'Hello there ;)', params, function(data){ console.log('@commit_stalker said: ' + data.message.text); });
          }
        }

        if (tempMessage.includes('check commits') || tempMessage.includes('have I commited?')){
          var cats = commits.get();
          console.log(cats);
          // if (status) {
          //   bot.postMessageToUser(tempUsername, 'My little birds tell me you did make a commit', params, function(data){ console.log('@commit_stalker said: ' + data.message.text); });
          // }
          // if (status == false){
          //   bot.postMessageToUser(tempUsername, 'I do not find a commit in my records... but I\'ll keep watching :scream:', params, function(data){ console.log('@commit_stalker said: ' + data.message.text); });
          // }
          // if (status == null){
          //   bot.postMessageToUser(tempUsername, 'There was an error getting your record. If this error continues, please message @theresa.', params, function(data){ console.log('@commit_stalker said: ' + data.message.text); });
          // }
        }

        if (tempMessage.includes('suck') || tempMessage.includes('worst') || tempMessage.includes('trash') || tempMessage.includes('stupid')) {
          bot.postMessageToUser(tempUsername, 'Just remember: I\'m the one that\'s stalking you :japanese_ogre:', params, function(data){ console.log('@commit_stalker said: ' + data.message.text); });
        }
      }
    }
  });
});

/** --------- FUNCTIONS ------------ **/

// get all users from the team, and make
function getTeamUsers(users){
  usernames = [];

  function CreateUser(username, userId){
    this.username = username;
    this.userId = userId;
  }

  var tempArray = bot.getUsers()._value.members;

  tempArray.forEach(function(user){
    var tempUser = new CreateUser(user.name, user.id);

    usernames.push(tempUser);
  });

  var usernamesLength = usernames.length;
  console.log('getTeamUsers() completed - ' + usernamesLength + ' users found.');
}


// find username with id
function findUsernameById(id){
  var tempID = id;
  var tempUsername;
  usernames.forEach(function(user){
    if (user.userId === tempID){
      tempUsername = user.username;
    }
    return tempUsername
  });
  console.log('Username found: ' + tempUsername);
  return tempUsername
}

// get all channels, match ID and name
function getTeamChannels(){
  channels = [];
  var tempChannels = bot.getChannels()._value.channels;

  function CreateChannel(channelName, channelId){
    this.channelName = channelName;
    this.channelId = channelId;
  }

  tempChannels.forEach(function(tempChannels){
    var tempChannel = new CreateChannel(tempChannels.name, tempChannels.id);
    channels.push(tempChannel);
  });
}

// find channel with id
function findChannelById(id){
  // var tempId = id;
  console.log(id);
  var tempChannel;
  var channels = [];

  channels.forEach(function(channel){
    if (channel.channelId === id){
      tempChannel = channel.channelName;
      console.log(tempChannel);
    }
  });
  return tempChannel;
}

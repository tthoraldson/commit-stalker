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
var admin = require('./bot/admin');

/** ---------- MIDDLEWARE ---------- **/
app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.json());
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
var tempStatus;

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
        console.log('--------------------------------------\nslack mention: ' + data.text);

        var tempMessage = data.text.toLowerCase();
        // find user from usernames array
        var tempUsername = findUsernameById(data.user);

        // ADMIN FUNCTIONALITY
        if (data.user == 'U28NDAKRR') { // current admin id
          console.log('ADMIN MESSAGE');

          if (tempMessage.includes('admin')){
              bot.postMessageToUser(tempUsername, 'Hello ADMIN', params, function(data){ console.log('@commit_stalker said: ' + data.message.text); });
          }

          if (tempMessage.includes('linus commits')){
            admin.checkTeamCommits();
          }

        }



        // if text says hello, hi, or hola
        if (tempMessage.includes('hello') || tempMessage.includes('hola')){
          if (data.type == 'message' && data.username != 'commit_stalker'){

            var tempUserId = data.user;

            bot.postMessageToUser(tempUsername, 'Hello there ;)', params, function(data){ console.log('@commit_stalker said: ' + data.message.text); });
          }
        }
        //
        if (tempMessage.includes('check commits') || tempMessage.includes('have i committed') || tempMessage.includes('did i make a commit today')){
          commits.get('tthoraldson').then(function (status) {
            tempStatus = status;
            console.log('temp status: ', tempStatus);
            if (tempStatus) {
              bot.postMessageToUser(tempUsername, 'My little birds tell me you did make a commit', params, function(data){ console.log('@commit_stalker said: ' + data.message.text); });
            }
            if (tempStatus === false){
              bot.postMessageToUser(tempUsername, 'I do not find a commit in my records... but I\'ll keep watching :scream:', params, function(data){ console.log('@commit_stalker said: ' + data.message.text); });
            }
            if (tempStatus === undefined){
              bot.postMessageToUser(tempUsername, 'There was an error getting your record. If this error continues, please message @theresa.', params, function(data){ console.log('@commit_stalker said: ' + data.message.text); });
            }
          });
        }
        // SASS RESPONSE
        if (tempMessage.includes('suck') || tempMessage.includes('worst') || tempMessage.includes('trash') || tempMessage.includes('stupid')) {
          bot.postMessageToUser(tempUsername, 'Just remember: I\'m the one that\'s stalking you :japanese_ogre:', params, function(data){ console.log('@commit_stalker said: ' + data.message.text); });
        }
        if (tempMessage.includes('denny')) {
          bot.postMessageToUser(tempUsername, ':nail_care::nail_care::nail_care:', params, function(data){ console.log('@commit_stalker said: ' + data.message.text); });
        }
        if (tempMessage.includes('joke')) {
          if (data.type == 'message' && data.username != 'commit_stalker'){
            bot.postMessageToUser(tempUsername, 'Do you think I have time to joke around when I\'m following you in every aspect of your internet life? :japanese_ogre:', params, function(data){ console.log('@commit_stalker said: ' + data.message.text); });
          }
        }
        if (tempMessage.includes('who are you')) {
          bot.postMessageToUser(tempUsername, 'It doesn\'t matter who I am, but rather what I do...\n if you\'re really lost, here\'s a link: https://en.wikipedia.org/wiki/Stalking', params, function(data){ console.log('@commit_stalker said: ' + data.message.text); });
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
  console.log(usernamesLength + ' users found');
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
  console.log('Current Conversation With: ' + tempUsername + ' ID: ' + id);
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
    }
  });
  return tempChannel;
}

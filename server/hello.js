'use strict';

var express = require('express');
var path = require('path');
var Bot = require('slackbots');

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
          bot.postMessageToUser(tempUsername, 'Checking for Commit....', params, function(data){ console.log('@commit_stalker said: ' + data.message.text); });
        }

        if (tempMessage.includes('suck') || tempMessage.includes('worst') || tempMessage.includes('trash') || tempMessage.includes('stupid')) {
          bot.postMessageToUser(tempUsername, 'Just remember: I\'m the one that\'s stalking you :japanese_ogre:', params, function(data){ console.log('@commit_stalker said: ' + data.message.text); });
        }
      }

      // if the string 'commit stalker' is said in a channel where @commit_stalker is present
      if (data.text.includes('commit stalker')){

        console.log(data.channel);
        console.log(channels);
        var tempChannel = findChannelById(data.channel);
        console.log(tempChannel);

        bot.postMessageToUser(tempChannel, 'Did someone say my name? :japanese_ogre:', params, function(data){ console.log('@commit_stalker said: ' + data.message.text); });
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

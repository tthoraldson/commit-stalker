'use strict';
var util = require('util');
var path = require('path');
var Bot = require('slackbots');
var WebSocket = require('ws');

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

var bot = new Bot(settings);

var usernames = [];

bot.on('start', function() {
  console.log('Bot is running!')

  // get user IDs and usernames
  var tempuser = bot.getUsers()._value.members;
    tempuser.forEach(function(user){
    console.log(user.name);
  });

  bot.on('message', function(data) {
    // if data from slack is a message
    if(data.text != undefined){

      // if text is directed @commit_stalker
      if(data.text.includes('<@U2B4DPJ68>')){

        // if text says hello, hi, or hola
        if(data.text.includes('hello') || data.text.includes('hi') || data.text.includes('hola')){
          if (data.type == 'message' && data.username != 'commit_stalker'){
            console.log(data);

            // var tempUser = data.user;
            // console.log(tempUser);
            // bot.postMessageToChannel(tempUser, 'Hello there, ' + tempUser + ' ;)', params, function(data){ console.log(data); });
          }
        }
      }
    }
  });
});

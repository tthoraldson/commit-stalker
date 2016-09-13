var express = require('express');
var mongoose = require('mongoose');
var util = require('util');
var path = require('path');
var Bot = require('slackbots');

var settings = {
  token = 'xoxb-79149800212-f6c2wMNAWfIUQz5Xm8e8uuec',
  name = 'commit_stalker'
}

var bot = new Bot(settings);

bot.on('start', function() {
    bot.postMessageToChannel('linus', 'Hello channel!');
});


var commit_stalker = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'commit_stalker';
    this.dbPath = settings.dbPath || path.resolve(process.cwd(), 'data', 'norrisbot.db');

    this.user = null;
    this.db = null;
};

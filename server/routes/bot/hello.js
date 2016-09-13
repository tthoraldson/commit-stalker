var express = require('express');
var mongoose = require('mongoose');
var util = require('util');
var path = require('path');
var Bot = require('slackbots');

var commit_stalkerBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'commit_stalker';
    this.dbPath = settings.dbPath || path.resolve(process.cwd(), 'data', 'commit_stalker.db');

    this.user = null;
    this.db = null;
};

// inherits methods and properties from the Bot constructor
util.inherits(commit_stalkerBot, Bot);

module.exports = commit_stalkerBot;

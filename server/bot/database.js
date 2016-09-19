var express = require('express');

// CREATE NEW USER
exports.createNewUser = function(name, github, slackId){
  function CreateNewUser(xname, xgithub, xslackId){
    this.name = xname;
    this.github = xgithub;
    this.slackID = xslackId;
    this.admin = false;
  }

  var tempUser = new CreateNewUser(name, github, slackID);

  var options {
    url: 'mongodb://localhost:27017/omicron/commitStalker'
  }

  
}

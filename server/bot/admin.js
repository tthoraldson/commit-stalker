var request = require('request');
var Promise = require('node-promise');

var linus = ['tthoraldson', 'Spengs', 'kerij', 'adameastvold', 'lizhaak', 'dennycheng', 'lpuhl', 'coreypeck', 'kmaimn', 'twinklefingers', 'dkuntz811', 'jtorborg', 'IamUnInc', '2trill2spill', 'andrewwiskus'];
var yesCommitted = [];
var noCommitted = [];

exports.checkTeamCommits = function(){
  yesCommitted = [];
  noCommitted = [];

  linus.forEach(function(user){
    getCommit(user).then(function(status){
      //console.log(user + ' - ' + status);
      if (status == true){
        yesCommitted.push(user);
        console.log(status);
      }
      if (status == false){
        noCommitted.push(user);
        console.log(status);
      }
    });
  });
}

var status;
var github;

var getCommit = function(uGithub, callback){
  github = uGithub;
  console.log(github);
  var deferred = Promise.defer();
  var options = {
    url: 'https://api.github.com/users/' + github + '/events',
    headers: {
      'User-Agent': 'tthoraldson',
      'token': process.env.GITHUB_AUTH
    }
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      info = JSON.parse(body);
      console.log(info);
      for (var i = 0; i < info.length; i++){
        var d = new Date(Date.parse(info[i].created_at));
        var commitDate = 'D' + d.getFullYear() + '_' + (d.getMonth() + 1) + '_' + d.getDate();

        var t = new Date();
        var todaysDate = 'D' + t.getFullYear() + '_' + (t.getMonth() + 1) + '_' + t.getDate();

        if (commitDate === todaysDate){
          if (info[i].type == 'PushEvent'){
            if (info[i].payload.ref == 'refs/heads/master'){
              status = true;
              console.log(status);
              break;
            }
          }
        } else {
          status = false;
        }
      }
      if (status == undefined){
        status = null;
      }
    }
    deferred.resolve(status);
  }
  request(options, callback)
  return deferred.promise;
}

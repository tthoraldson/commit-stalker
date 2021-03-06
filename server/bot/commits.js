var request = require('request');
var Promise = require('node-promise');
var status;
var github; //= 'tthoraldson';

exports.get = function(uGithub, callback){
  github = uGithub;
  console.log(github);
  var deferred = Promise.defer();
  var options = {
    url: 'https://api.github.com/users/' + github + '/events',
    headers: {
      'User-Agent': 'request'
    }
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      info = JSON.parse(body);
      // console.log(info);
      for (var i = 0; i < info.length; i++){
        var d = new Date(Date.parse(info[i].created_at));
        var commitDate = 'D' + d.getFullYear() + '_' + (d.getMonth() + 1) + '_' + d.getDate();

        var t = new Date();
        var todaysDate = 'D' + t.getFullYear() + '_' + (t.getMonth() + 1) + '_' + t.getDate();

        if (commitDate === todaysDate){
          if (info[i].type == 'PushEvent'){
            if (info[i].payload.ref == 'refs/heads/master'){
              status = true;
              // console.log(status);
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
 //   .on('response', function(data){
 //     console.log('async status: ' + status);
 // });
  return deferred.promise;
}

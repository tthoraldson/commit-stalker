var request = require('request');

exports.get = function(){
  var status;
  var eventLog;
  var github = 'tthoraldson'


  var options = {
    url: 'https://api.github.com/users/' + github + '/events',
    headers: {
      'User-Agent': 'request'
    }
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      info = JSON.parse(body);
      for (var i = 0; i < info.length; i++){
        var d = new Date(Date.parse(info[i].created_at));
        var commitDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();

        var t = new Date();
        var todaysDate = t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate();

        if (commitDate === todaysDate){
          if (info[i].type == 'PushEvent'){
            if (info[i].payload.ref == 'refs/heads/master'){
              status = true;
              console.log(status);
              break;
            }
            else {
              status = false;
            }
          }
          else {
            status = false;
          }
        }
      }
    } else {
      status = null;
    }
  }
  request(options, callback);

}

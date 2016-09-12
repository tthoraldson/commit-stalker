var express = require('express');
var router = express.Router();

router.post('/hello', function(req, res, next){
  var userName = req.body.user_name;
  var botPayload = {
    text: 'Hello, ' + userName + '!'
  }
  if (userName !== 'commit_stalker'){
    return res.status(200).json(botPayload);
  } else {
    res.status(200).end();
  }
});

module.exports = router;

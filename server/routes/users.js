ar express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function (req, res) {
  User.find({}, function (err, users) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    res.send(users);
  });
});


router.post('/', function (req, res) {
  console.log('POST', req.body);
  var user = User(req.body);
  user.save(function (err) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    res.sendStatus(201); // CREATED
  });
});

router.put('/:id', function (req, res) {
  var user = req.body;
  var id = req.params.id;
  User.findByIdAndUpdate(id, user, function (err, user) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    res.status(204).send(user);
  });
});

// router.delete('/:id', function (req, res) {
//   var id = req.params.id;
//   Book.findByIdAndRemove(id, function (err) {
//     if (err) {
//       res.sendStatus(500);
//       return;
//     }
//
//     res.sendStatus(204);
//   });
// });

/** -- COMMENTS ROUTE -- **/
// router.post('/:id/comments', function (req, res) {
//   var id = req.params.id;
//   var comment = req.body;
//   console.log('New comment data', comment);
//
//   Book.findById(id, function (err, book) {
//     if (err) {
//       res.sendStatus(500);
//       return;
//     }
//
//     book.comments.push(comment);
//     book.save(function (err) {
//       if (err) {
//         console.log('Error: ', err);
//         res.sendStatus(500);
//         return;
//       }
//
//       res.sendStatus(204);
//     });
//   });
// });

module.exports = router;

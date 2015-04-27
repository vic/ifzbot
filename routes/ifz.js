var express = require('express');
var router = express.Router();


router.post('/', function(req, res, next) {
  console.log(">>>>>>>> ", sys.inspect(req.body));

  var url = req.body.tags[0];
  var text = req.body.description;
  var screen_name = req.body.title;


  reply(url, screen_name, text, function () {
    console.log("<<<<<<<<<< ", sys.inspect(arguments));
  });

  res.send('');
});

module.exports = router;

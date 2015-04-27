var express = require('express');
var router = express.Router();
var Twit = require('twit');
var sys = require('sys');

var T = new Twit({
    consumer_key:         process.env.consumer_key
  , consumer_secret:      process.env.consumer_secret
  , access_token:         process.env.ifzbot_key
  , access_token_secret:  process.env.ifzbot_secret
})

function reply(tweet_url, screen_name, status, cb) {
  var id = tweet_url.match(/[\w-]+$/)[0];
  return T.post('statuses/update', {
    status: sys.format('@%s %s', screen_name, status),
    in_reply_to_status_id: id
  }, cb);
}

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

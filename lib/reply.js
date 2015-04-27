var Twit = require('twit');
var sys = require('sys');
var http = require('http');

var T = new Twit({
    consumer_key:         process.env.consumer_key
  , consumer_secret:      process.env.consumer_secret
  , access_token:         process.env.ifzbot_key
  , access_token_secret:  process.env.ifzbot_secret
});

function tweetIdFromTwitterUrl (url, cb) {
  cb(null, url.match(/[\w-]+$/)[0]);
} 

function tweetIdFromIFTTTUrl (url, cb) {
  http.get(url, function (res) {
    tweetIdFromTwitterUrl( res.headers['location'], cb );
  });
}

function tweetIdFromUrl(url, cb) {
  if ( url.match(/ift.tt/) ) {
    tweetIdFromIFTTTUrl(url, cb);
  } else {
    tweetIdFromTwitterUrl(url, cb);
  }
}

function reply(id, screen_name, status, cb) {
  return T.post('statuses/update', {
    status: sys.format('@%s %s', screen_name, status),
    in_reply_to_status_id: id
  }, cb);
}

function replyTweet(status, screen_name, url, cb) {
  console.log("@"+screen_name+" "+status);
  return cb(null, "ok");
  tweetIdFromUrl(url, function (_, id) {
    reply(id, screen_name, status, cb);
  });
}

module.exports = replyTweet;
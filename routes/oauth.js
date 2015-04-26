var sys = require('sys');
var oauth = require('oauth');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  twitterOauth().getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
    if (error) {
      res.send("Error getting OAuth request token : " + sys.inspect(error), 500);
    } else {  
      req.session.oauthRequestToken = oauthToken;
      req.session.oauthRequestTokenSecret = oauthTokenSecret;
      res.redirect("https://twitter.com/oauth/authorize?oauth_token="+req.session.oauthRequestToken);      
    }
  });
})

router.get('/callback', function (req, res) {
  console.log(">>"+req.session.oauthRequestToken);
  console.log(">>"+req.session.oauthRequestTokenSecret);
  console.log(">>"+req.query.oauth_verifier);
  var consumer = twitterOauth();
  consumer.getOAuthAccessToken(req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
    if (error) {
      res.send("Error getting OAuth access token : " + sys.inspect(error) + "["+oauthAccessToken+"]"+ "["+oauthAccessTokenSecret+"]"+ "["+sys.inspect(results)+"]", 500);
    } else {
      req.session.oauthAccessToken = oauthAccessToken;
      req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
      console.log("AUTH ACCES ", oauthAccessToken, oauthAccessTokenSecret);
      // Right here is where we would write out some nice user stuff
      consumer.get("http://twitter.com/account/verify_credentials.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response) {
        if (error) {
          res.send("Error getting twitter screen name : " + sys.inspect(error), 500);
        } else {
          req.session.twitterScreenName = data["screen_name"];    
          console.log(sys.inspect(req.session));
          res.send('You are signed in: ' + req.session.twitterScreenName)
        }  
      });  
    }
  });
})

function twitterOauth() {
  var url = process.env.APP_URL;
  return new oauth.OAuth("https://twitter.com/oauth/request_token",
                 "https://twitter.com/oauth/access_token", 
                 process.env.consumer_key, process.env.consumer_secret, 
                 "1.0A", url+"/oauth/callback", "HMAC-SHA1");
}

module.exports = router;

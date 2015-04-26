var express = require('express');
var sys = require('sys');
var oauth = require('oauth');

var app = express();

app.dynamicHelpers({
  session: function(req, res){
    return req.session;
  }
});

var webhook = require('express-ifttt-webhook');
app.use(webhook());

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/ifz', function (req, res) {
  res.send('foo');
});

app.get('/oauth', function (req, res) {
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

app.get('/oauth/callback', function (req, res) {
  sys.puts(">>"+req.session.oauthRequestToken);
  sys.puts(">>"+req.session.oauthRequestTokenSecret);
  sys.puts(">>"+req.query.oauth_verifier);
  var consumer = twitterOauth();
  consumer.getOAuthAccessToken(req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
    if (error) {
      res.send("Error getting OAuth access token : " + sys.inspect(error) + "["+oauthAccessToken+"]"+ "["+oauthAccessTokenSecret+"]"+ "["+sys.inspect(results)+"]", 500);
    } else {
      req.session.oauthAccessToken = oauthAccessToken;
      req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
      // Right here is where we would write out some nice user stuff
      consumer.get("http://twitter.com/account/verify_credentials.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response) {
        if (error) {
          res.send("Error getting twitter screen name : " + sys.inspect(error), 500);
        } else {
          req.session.twitterScreenName = data["screen_name"];    
          sys.puts(sys.inspect(req.session));
          res.send('You are signed in: ' + req.session.twitterScreenName)
        }  
      });  
    }
  });
})

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

function twitterOauth() {
  var url = process.env.APP_URL;
  return new oauth.OAuth("https://twitter.com/oauth/request_token",
                 "https://twitter.com/oauth/access_token", 
                 process.env.consumer_key, process.env.consumer_secret, 
                 "1.0A", url+"/oauth/callback", "HMAC-SHA1");
}
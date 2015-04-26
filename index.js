var express = require('express');
var app = express();

var webhook = require('express-ifttt-webhook');
app.use(webhook());


app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/ifz', function (req, res) {
  res.send('');
});

var server = app.listen(process.env['PORT'] || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
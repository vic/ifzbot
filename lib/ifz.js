var player = require('./player');
var command = require('./command');
var reply = require('./reply');

function ifz(input, cb) {
  doInput(input, function (err, out) {
    if (err) { return cb(err); }
    reply(out, input.from, input.url, function (err, out) {
      cb(err, 'ok');
    })
  });
}

function doInput (input, cb) {
  var meta = command(input);
  if (meta) {
    meta(input, cb);
  } else {
    player(input, cb);
  }
}

module.exports = ifz;
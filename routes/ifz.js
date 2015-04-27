var sys = require('sys');
var lodash = require('lodash');
var router = require('express').Router();
var ifz = require('../lib/ifz');


router.post('/', function(req, res, next) {

  var payload = {
    username: 'ifzbot',
    from: req.body.from,
    text: req.body.text,
    url:  req.body.url
  }

  ifz(payload, function (err, data){ 
    res.send(sys.inspect(err || data));
  })

});

module.exports = router;

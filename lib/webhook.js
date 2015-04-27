var ifz = require('./ifz');

function isReplyToMe(me, text) {
  return new RegExp('^@'+me).test(text);
}

function repliedText(me, text) {
  return text.replace(new RegExp('^@'+me+'\s+'), '');
}

function webhook(payload, cb) {
  var me = payload.username;
  var text = payload.description.text;
  var from = payload.description.from;
  var url  = payload.description.url;

  if (!isReplyToMe(me, text)) {
    return cb('not directed to me');
  }

  text = repliedText(me, text);
  
  ifz({
    me: me, from: from, url: url, text: text
  }, cb)
}

module.exports = webhook;
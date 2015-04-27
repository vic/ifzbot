var fs = require('fs');

function command (input) {
  if ( input.text.indexOf('/') !== 0 ) {
    return;
  }
  input.commandName = input.text.split(/\s+/, 1)[0].replace('/', ''); 
  input.commandArgs = input.text.split(/\s+/).slice(1);
  return command.known[input.commandName] || command.known.wtf;
}

command.known = {}
fs.readdirSync(__dirname+'/commands').forEach(function (x) {
  if (/\.js$/.test(x)) {
    var name = x.replace('.js', '') 
    command.known[name] = require('./commands/'+name)
  }
})

module.exports = command;
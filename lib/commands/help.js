var _ = require('lodash');

var help = {

  help: "Hi, I'm izbot\n\n\
  I'm an Interative Fiction games bot.\n\
  You can get help on any particular command with:\n\
  \n /help COMMAND\n\
  To get the list of available commands use:\n\
  \n /help commands",

  load: "You might want to load any game\n\
  from http://playfic.com/ by giving me a USER/GAME like:\n\
  \n   /load grafofilia/roshambo\n\n\
  or from ifarchive.org/if-archive/games/zcode/ by giving me a filename, like:\n\
  \n   /load LostPig.z8\n\n\
  Have Fun!"
  
};

help.commands = "Available commands:\n"+_.keys(help).join(', ');

function run (input, cb) {
  cb(null, help[input.commandArgs[0]] || help['help']);
}

module.exports = run
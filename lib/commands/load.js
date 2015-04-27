var ZVM = require('ifvms').ZVM;
var iconv = require('iconv-lite');
var http = require('http');

var VALID_GAME_LOC = "Valid locations:\n\
USERNAME/GAME from playfic.com\n\
GAME.EXT from ifarchive.org"

var IFARCHIVE = 'http://www.ifarchive.org/if-archive/games/zcode/'
var PLAYFIC = 'http://playfic.com/'

var loaded_games = {

}

// From ifvms
function text_to_array( text, array )
{
  var i = 0, l;
  array = array || [];
  for ( l = text.length % 8; i < l; ++i )
  {
    array.push( text.charCodeAt( i ) );
  }
  for ( l = text.length; i < l; )
  {
    // Unfortunately unless text is cast to a String object there is no shortcut for charCodeAt,
    // and if text is cast to a String object, it's considerably slower.
    array.push( text.charCodeAt( i++ ), text.charCodeAt( i++ ), text.charCodeAt( i++ ), text.charCodeAt( i++ ),
      text.charCodeAt( i++ ), text.charCodeAt( i++ ), text.charCodeAt( i++ ), text.charCodeAt( i++ ) );
  }
  return array;
}

function newVM(buffer) {
  var data = iconv.decode(buffer, 'latin1');
  var vm = new ZVM(); 
  vm.inputEvent({code: 'load', data: text_to_array(data) });
  vm.restart();
  vm.log = '';
  return vm;
}

function isValidGameLoc(loc) {
  return /^(\w+\/\w+|\w+\.\w+)$/.test(loc); 
}

function downloadPlayfic(url, cb) {
  downloadRaw(url, function (err, buffer) {
    if(err) return cb(err);
    var body = buffer.toString();
    var loc = body.match(/\/releases\/.*?\.z8/)[0];
    downloadRaw(PLAYFIC+loc, cb);
  })
}

function downloadRaw(url, cb) {
  http.get(url, function (res) {
    var chunks = [];
    res.on('data', function(chunk) {
      chunks.push(chunk);
    });
    res.on('end', function() {
      cb(null, Buffer.concat(chunks));
    });
  }).on('error', cb);
}

function downloadGame(loc, cb) {
  if (/\//.test(loc)) {
    downloadPlayfic(PLAYFIC+'games/'+loc, cb);
  } else {
    downloadRaw(IFARCHIVE+loc, cb);
  }
}

function load (input, cb) {
  var gameLoc = input.commandArgs[0];

  if (loaded_games[gameLoc]) {
    return cb(null, loaded_games[gameLoc]);
  }

  if (!isValidGameLoc(gameLoc)) {
    return cb(VALID_GAME_LOC)
  }

  downloadGame(gameLoc, function (err, buffer) {
    if (err) return cb(err);
    var vm = newVM(buffer);
    loaded_games[gameLoc] = vm;
    cb(null, vm);
  })
}

module.exports = load;
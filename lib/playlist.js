var playlist = [];
var library = [];

try {
  library = require('../library.json');
  console.log(library);
} catch (ex) {
  // load the library
  console.log(ex);
}

module.exports = function(io, socket) {
  socket.on('api:playlist:add', function(file) {
    console.log(file);
    // find the song from library, add to playlist.
    var song = library.filter(function(entry) {
      return entry.file == file;
    });

    // emit api:playlist:change
    playlist.push(song[0]);
    io.emit('api:playlist:change', playlist);
  });

  socket.on('api:playlist:list', function() {
    io.emit('api:playlist:change', playlist);
  });
}

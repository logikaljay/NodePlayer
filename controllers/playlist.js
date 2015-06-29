var library = require('../lib/library');
var playlist = [];

module.exports = function(io, socket) {
  socket.on('api:playlist:add', function(file) {
    // find the song from library, add to playlist.
    var song = library.items.filter(function(entry) {
      return entry.file == file;
    });

    // emit api:playlist:change
    playlist.push(song[0]);
    io.emit('api:playlist:change', playlist);
  });

  socket.on('api:playlist:list', function() {
    io.emit('api:playlist:change', playlist);
  });

  socket.on('api:playlist:remove', function(file) {
    playlist = playlist.filter(function(item) {
      return item.file !== file;
    });

    io.emit('api:playlist:change', playlist);
  });
}

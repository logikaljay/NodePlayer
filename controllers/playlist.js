var library = require('../lib/library');
var sqlite3 = require('sqlite3').verbose();
var playlist = [];

module.exports = function(io, socket) {
  socket.on('api:playlist:add', function(song) {
    var db = new sqlite3.Database(__dirname + '/../library.db');
    db.serialize(function() {
      db.run("DELETE FROM playlist WHERE file = ?", song.file);

      var stmt = db.prepare(
        'INSERT INTO playlist (file, title, artist, album, duration)' +
        'VALUES (?, ?, ?, ?, ?)'
      );

      stmt.run(song.file, song.title, song.artist, song.album, song.duration);
      stmt.finalize();

      db.all("SELECT * FROM playlist", function(err, rows) {
        // emit to all sockets
        io.emit('api:playlist:change', rows);
      });
    });

    db.close();
  });

  socket.on('api:playlist:list', function(fn) {
    var db = new sqlite3.Database(__dirname + '/../library.db');
    db.serialize(function() {
      db.all("SELECT * FROM playlist", function(err, rows) {
        // emit to socket that requested the list
        fn(rows);
      });
    });

    db.close();
  });

  socket.on('api:playlist:remove', function(song) {
    var db = new sqlite3.Database(__dirname + '/../library.db');
    db.serialize(function() {
      var stmt = db.prepare('DELETE FROM playlist WHERE file = ?');
      stmt.run(song.file);
      stmt.finalize();

      db.all("SELECT * FROM playlist", function(err, rows) {
        // emit to all sockets
        io.emit('api:playlist:change', rows);
      });
    });

    db.close();
  });
}

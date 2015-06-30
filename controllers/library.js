var fs = require('fs');
var albumArt = require('album-art');
var async = require('async');
var mm = require('musicmetadata');
var albumArt = require('album-art');
var library = require('../lib/library');
var walk = require('../helpers/walk');
var sqlite3 = require('sqlite3').verbose();

module.exports = function(io, socket) {
  /**
   *  List library
   */
  socket.on('api:library:list', function() {
    var db = new sqlite3.Database(__dirname + '/../library.db');
    db.serialize(function() {
      db.all("SELECT * FROM library", function(err, rows) {
        io.emit('api:library:list', rows);
      });
    });

    db.close();
  });

  socket.on('api:library:refresh', function() {
    library.refresh(function() {
      var db = new sqlite3.Database(__dirname + '/../library.db');
      db.serialize(function() {
        db.all("SELECT * FROM library", function(err, rows) {
          io.emit('api:library:list', rows);
        });
      });

      db.close();
    })
  });

  socket.on('api:library:artists', function(fn) {
    var db = new sqlite3.Database(__dirname + '/../library.db');
    db.serialize(function() {
      db.all("SELECT artist FROM library GROUP BY artist ORDER BY artist", function(err, rows) {
        fn(rows);
      });
    });

    db.close();
  });

  socket.on('api:library:songs', function(data, fn) {
    console.log(data);
    var db = new sqlite3.Database(__dirname + '/../library.db');
    db.serialize(function() {
      db.all("SELECT * FROM library WHERE artist = ?", data.artist, function(err, rows) {
        fn(rows);
      });
    });

    db.close();
  });

  socket.on('api:library:search', function(term) {

  });
}

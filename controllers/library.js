var fs = require('fs');
var albumArt = require('album-art');
var async = require('async');
var mm = require('musicmetadata');
var albumArt = require('album-art');
var library = require('../lib/library');
var walk = require('../helpers/walk');
var sqlite3 = require('sqlite3').verbose();
var art = require('../lib/art');

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

          // iterate over rows - downloading album art if necessary
          if (typeof rows !== 'undefined') {
            rows.forEach(function(row) {
              art(row.artist, row.album);
            });
          }

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
    var db = new sqlite3.Database(__dirname + '/../library.db');
    db.serialize(function() {
      db.all("SELECT * FROM library WHERE artist = ?", data.artist, function(err, rows) {
        fn(rows);
      });
    });

    db.close();
  });

  socket.on('api:library:search', function(text) {
    // firstly, get the list of songs that match the text
    var db = new sqlite3.Database(__dirname + '/../library.db');
    db.serialize(function() {
      db.all("SELECT * FROM library WHERE LOWER(artist) LIKE '%"+text+"%' OR LOWER(album) LIKE '%"+text+"%' OR LOWER(title) LIKE '%"+text+"%'", function(err, rows) {
        console.log(rows);
        socket.emit('api:library:searchResult', rows);
      });
    });

    db.close();
  });
}

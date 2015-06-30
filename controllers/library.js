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
    console.log('refreshing');
    socket.emit('api:library:refreshing');

    library.refresh(function() {
      var db = new sqlite3.Database(__dirname + '/../library.db');
      db.serialize(function() {
        // iterate over artists for art work
        db.all("SELECT artist, album FROM library ORDER BY artist", function(err, rows) {

          // iterate over rows - downloading album art if necessary
          if (typeof rows !== 'undefined') {
            var fetched = [];

            rows.forEach(function(row) {
              // don't fetch something we have already requested
              if (fetched.indexOf(row.artist + row.album) == -1) {
                art(row.artist, row.album);
                fetched.push(row.artist + row.album);
              }
            });
          }
        });

        // iterate over artists for list
        db.serialize(function() {
          db.all("SELECT artist FROM library GROUP BY artist ORDER BY artist", function(err, rows) {
            io.emit('api:library:artists', rows);
          });
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

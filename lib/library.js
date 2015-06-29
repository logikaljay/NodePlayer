var walk = require('../helpers/walk');
var async = require('async');
var fs = require('fs');
var mm = require('musicmetadata');
var sqlite3 = require('sqlite3').verbose();

module.exports = {
  refresh: function(done) {

    var db = new sqlite3.Database('/Users/jaybaker/Documents/Node/NodePlayer/library.db');
    db.run('delete from library');

    walk('./public/data', function(err, results) {
      var songs = [];
        async.each(results, function(result, cb) {
          mm(fs.createReadStream(result), { duration: true }, function(err, data) {
            if (typeof data.artist !== 'string') {
              data.artist = data.artist.join();
            }

            var song = {
              title: data.title,
              artist: data.artist,
              album: data.album,
              duration: data.duration,
              file: result,
            };

            db.serialize(function() {
              var stmt = db.prepare('INSERT INTO library VALUES (?, ?, ?, ?, ?)');
              stmt.run(song.file, song.title, song.artist, song.album, song.duration);

              stmt.finalize();
            });

            cb();
          });
        }, function(err) {

          db.close();
          done();
        });
    });
  },

  getItems: function(done) {
    var songs = [];
    var db = new sqlite3.Database('/Users/jaybaker/Documents/Node/NodePlayer/library.db');
    db.serialize(function() {
      db.all("SELECT * FROM library", function(err, rows) {
        done(rows);
      });
    });

    db.close();
  }
}

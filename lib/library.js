var walk = require('../helpers/walk');
var async = require('async');
var fs = require('fs');
var mm = require('musicmetadata');
var sqlite3 = require('sqlite3').verbose();

module.exports = {
  refresh: function(done) {

    var db = new sqlite3.Database(__dirname + '/../library.db');
    db.run('DELETE FROM library');

    walk(__dirname + '/../client/data', function(err, results) {
      var songs = [];
        async.each(results, function(result, cb) {
          mm(fs.createReadStream(result), function(err, data) {
            if (typeof data.artist !== 'string') {
              data.artist = data.artist.join();
            }

            var song = {
              title: data.title,
              artist: data.artist,
              album: data.album,
              file: result,
            };

            if (song.title.length == 0) {
              console.log(song);
            }

            db.serialize(function() {
              var stmt = db.prepare(
                'INSERT INTO library (file, title, artist, album, duration)' +
                'VALUES (?, ?, ?, ?, ?)'
              );

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
}

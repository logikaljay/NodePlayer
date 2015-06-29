var walk = require('../helpers/walk');
var async = require('async');
var fs = require('fs');
var mm = require('musicmetadata');

module.exports = {
  _items: require('../library.json'),
  items: this._items,

  refresh: function(done) {
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

          songs.push(song);

          cb();
        });
      }, function(err) {

        // sort the array
        songs = songs.sort(function(a, b) {
          return a.artist - b.artist;
        });

        fs.writeFile('/Users/jaybaker/Documents/Node/NodePlayer/library.json', JSON.stringify(songs), function(err) {
          this.items = songs;
          done(songs);
        });
      })
    });
  }
}

var fs = require('fs');
var albumArt = require('album-art');
var async = require('async');
var mm = require('musicmetadata');
var albumArt = require('album-art');
var library = require('../lib/library');
var walk = require('../helpers/walk');

module.exports = function(io, socket) {
  /**
   *  List library
   */
  socket.on('api:library:list', function() {
    io.emit('api:library:list', require('../library.json'));
  });

  socket.on('api:library:refresh', function() {
    walk('./public/data', function(err, results) {
      var songs = [];
      async.each(results, function(result, cb) {
        mm(fs.createReadStream(result), {duration: true}, function(err, data) {
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
        fs.writeFile('/Users/jaybaker/Documents/Node/NodePlayer/library.json', JSON.stringify(songs), function(err) {
          io.emit('api:library:list', songs);
        });
      })
    });
  });

  socket.on('api:library:search', function(term) {

  });
}

var fs = require('fs');
var albumArt = require('album-art');
var async = require('async');
var mm = require('musicmetadata');
var albumArt = require('album-art');
var walk = require('../helpers/walk');

function rebuild(done) {
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
      fs.writeFile('./library.json', JSON.stringify(songs), function(err) {
        done(songs);
      });
    })
  });
}

module.exports = function(io, socket) {
  /**
   *  List library
   */
  socket.on('api:library:list', function() {
    var songs = [];
    try {
      songs = require('./library.json');
      io.emit('api:library:list', songs);
    } catch (ex) {
      rebuild(function(result) {
        songs = result;
        io.emit('api:library:list', songs);
      })
    };
  });

  io.on('api:library:refresh', function() {
    rebuild(function(songs) {
      socket.emit('api:library:list', songs);
    });
  });

  io.on('api:library:search', function(term) {

  });
}

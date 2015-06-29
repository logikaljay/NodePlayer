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
    library.getItems(function(items) {
      io.emit('api:library:list', items);
    });

  });

  socket.on('api:library:refresh', function() {
    library.refresh(function() {
      library.getItems(function(items) {
        console.log(items);
        io.emit('api:library:list', items);
      });
    })
  });

  socket.on('api:library:search', function(term) {

  });
}

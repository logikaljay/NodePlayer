var albumArt = require('album-art');

module.exports = function(io) {
  var sockets = io.sockets;

  sockets.on('api:art:getlarge', function(file) {
    albumArt('Sublime', 'Greatest Hits', 'mega', function(err, url) {
      if (url !== null) {
        console.log('emitting: ' + url);
        sockets.emit('api:art:get', url);
      } else {
        // socket.emit('api:art:get', path.to.default.albumArt);
      }
    });
  });
}

var albumArt = require('album-art');
var fs = require('fs');
var http = require('http');

module.exports = function(artist, album) {
  // make sure artist and album are set
  if (artist.length == 0 || album.length == 0) {
    return;
  } else {
    // check if file exists:
    var filePath = __dirname + "/../client/art/small-" + artist + "-" + album + ".jpg";
    fs.exists(filePath, function(exists) {
      if (!exists) {
        console.log("Downloading album art for: " + artist + " - " + album);
        // get the file
        albumArt(artist, album, 'small', function(err, url) {

          if (!err) {
            console.log("Found url " + album + ": " + url);
            var file = fs.createWriteStream(filePath);
            var request = http.get(url, function(response) {
              response.pipe(file);
              file.on('finish', function() {
                file.close();
              });
            });
          } else {
            // use default img
          }
        });
      }
    });
  }
}

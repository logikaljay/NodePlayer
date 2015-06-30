var albumArt = require('album-art');
var fs = require('fs');
var http = require('http');

module.exports = function(artist, album) {
  // check if file exists:
  var filePath = __dirname + "/../client/art/small-" + artist + "-" + album + ".jpg";
  fs.exists(filePath, function(exists) {
    if (!exists) {
      console.log("Downloading album art for: " + artist + " - " + album);
      // get the file
      albumArt(artist, album, 'small', function(err, url) {
        var file = fs.createWriteStream(filePath);
        var request = http.get(url, function(response) {
          response.pipe(file);
          file.on('finish', function() {
            file.close();
          });
        });
      });
    }
  });
}

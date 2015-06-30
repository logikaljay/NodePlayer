var fs = require('fs');

var upload = function(req, res) {
  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    console.log("Uploading: " + filename);
    fstream = fs.createWriteStream(__dirname + '/../client/data/' + filename);
    file.pipe(fstream);
    fstream.on('close', function () {
      res.sendStatus(200);
    });
  });
};

module.exports = upload;

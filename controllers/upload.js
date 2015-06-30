var fs = require('fs');

var upload = function(req, res) {
  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    console.log("Uploading: " + filename);
    var date = new Date();
    var prefix = ""+date.getFullYear() + date.getMonth() + date.getDay() + date.getHours() + date.getMinutes() + date.getSeconds();
    var path = __dirname + "/../client/data/" + prefix;
    if (!fs.existsSync(path)) {
      fs.mkdir(path);
    }

    fstream = fs.createWriteStream(path + "/" + filename);
    file.pipe(fstream);
    fstream.on('close', function () {
      res.sendStatus(200);
    });
  });
};

module.exports = upload;

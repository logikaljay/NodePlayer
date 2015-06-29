var fs = require('fs');

var upload = function(req, res) {
  console.log(req.files);
  fs.readFile(req.files[0], function(err, data) {
    var newPath = __dirname + "/public/data/" + req.files[0].name;
    fs.writeFile(newPath, data, function(err) {
      console.log(err);
    });
  });
};

module.exports

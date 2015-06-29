var fs = require('fs');
var http = require('http');
var express = require('express');
var busboy = require('connect-busboy');
var app = express();
var server = http.createServer(app).listen(3000, function() {
});
var io = require('socket.io').listen(server);

app.use(express.static('public'));
app.use(busboy());
app.set('views', __dirname + "/views");
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

app.post('/upload', function(req, res) {
  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    console.log("Uploading: " + filename);
    fstream = fs.createWriteStream(__dirname + '/public/data/' + filename);
    file.pipe(fstream);
    fstream.on('close', function () {
    });
  });
});

require('./controllers/art')(io);

io.on('connection', function(socket) {
	require('./controllers/controls')(io, socket);
	require('./controllers/library')(io, socket);
	require('./controllers/playlist')(io, socket);
});

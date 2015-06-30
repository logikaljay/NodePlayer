var fs = require('fs');
var http = require('http');
var express = require('express');
var busboy = require('connect-busboy');
var app = express();
var server = http.createServer(app).listen(3000, function() {
});
var io = require('socket.io').listen(server);


app.use(express.static('client'));
app.use(busboy());

app.post('/upload', require('./controllers/upload'));

io.on('connection', function(socket) {
	require('./controllers/controls')(io, socket);
	require('./controllers/library')(io, socket);
	require('./controllers/playlist')(io, socket);
});

process.on('uncaughtException', function(err) {
  throw err;
});

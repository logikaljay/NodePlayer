var http = require('http');
var mipod = require('mipod');
var express = require('express');
var app = express();
var server = http.createServer(app).listen(3000, function() {
});
var io = require('socket.io').listen(server);

app.use(express.static('public'));

app.set('views', __dirname + "/views");
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

io.on('connection', function(socket) {
  mipod.asWebSocket(socket, {
    prefix: 'api:',
    dataPath: '/Users/jaybaker/Music/mpdisco'
  });
})

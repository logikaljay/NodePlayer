var fs = require('fs');
var progress = require('progress-stream');
var lame = require('lame');
var Speaker = require('speaker');
var current = {};
var t;

module.exports = function(socket) {
	socket.on('current', function() {
		socket.emit('current', progress);
	});
	socket.on('play', function(obj) {
		console.log(obj);
		var position = obj.position || 0;
		var file = obj.file;
		var stat = fs.statSync(file);

		current = progress({
			length: stat.size,
			time: 100
		});

		fs.createReadStream(file, { start: position })
			.pipe(current)
			.pipe(new lame.Decoder)
			.on('format', console.log)
			.pipe(new Speaker);

		t = setInterval(function() {
			socket.emit('status', current.progress());
		}, 300)
	});
}

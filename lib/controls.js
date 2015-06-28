var fs = require('fs');
var Mplayer = require('node-mplayer');

var t;

var PlayerState = {
		playing: 1,
		paused: 2,
		stopped: 3,
		idle: 0,
};

// setup the player
var player = new Mplayer();
console.log("New player");

var initalStatus = {
	state: PlayerState.idle,
	file: '',
	elapsed: 0,
	duration: 0,
};
var status = initalStatus;

module.exports = function(io, socket) {
	player.on('end', function() {
		clearInterval(t);

		// check if queue.length > 0
		// true: next song
		// false:
		status.state = PlayerState.idle;
	})

	/**
	 *	Play command
	 */
	socket.on('api:controls:play', function(obj) {
		console.log('received play');
		// check if we are resuming, or playing new file
		if (status.state != PlayerState.idle) {
			// resume playback with pause() toggle
			player.pause();
		} else {
			// start new playback
			player.setFile(obj.file);
			player.play();
		}

		// setup current obj
		status.file = obj.file;
		status.state = PlayerState.playing;

		t = setInterval(function() {
			player.getTimePosition(function(elapsed) {
				status.elapsed = elapsed;

				// emit current position
				io.emit('api:controls:status', status);
			});
		}, 1000);
	});

	/**
	 *	Pause command
	 */
	socket.on('api:controls:pause', function() {
		console.log("Received pause");

		// pause mplayer
		player.pause();

		// invalidate the timer
		clearInterval(t);

		// set status to paused
		status.state = PlayerState.paused;

		// emit current status
		io.emit('api:controls:status', status);
	});

	/**
	 *	Stop command
	 */
	socket.on('api:controls:stop', function() {
		console.log('Received stop')

		if (status.state == PlayerState.playing
			|| status.state == PlayerState.paused) {
				// stop music
			player.stop();

			// set state to stopped
			status.state = PlayerState.stopped;

			// invalidate timer
			clearInterval(t);

			// set teh status to initial state
			status = initalStatus;

			// emit current position
			io.emit('api:controls:status', status);
		}
	});
}

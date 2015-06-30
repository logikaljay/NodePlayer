var fs = require('fs');
var Mplayer = require('node-mplayer');
var mm = require('musicmetadata');
var sqlite3 = require('sqlite3').verbose();
var t,
    player;

var stopped = false;
var PlayerState = {
		playing: 1,
		paused: 2,
		stopped: 3,
		idle: 0,
};

var initalStatus = {
	state: PlayerState.idle,
	file: '',
	elapsed: 0,
	duration: 0,
};
var status = initalStatus;

module.exports = function(io, socket) {
	/**
	 *	Play command
	 */
	socket.on('api:controls:play', function(obj) {
		console.log('received play');
		// check if we are resuming, or playing new file
		if (status.state == PlayerState.paused) {
			// resume playback with pause() toggle
			player.pause();
		} else {

			// start new player
 		 	player = new Mplayer();
			player.setFile(obj.file);
			player.play();

			var parser = mm(fs.createReadStream(obj.file), {duration: true}, function(err, data) {
				status.duration = data.duration;
				status.title = data.title;
				status.artist = data.artist;
				status.album = data.album;
			});
		}

		// setup current obj
		status.file = obj.file;
		status.state = PlayerState.playing;

		clearInterval(t);
		t = setInterval(function() {
			try {
				player.getTimePosition(function(elapsed) {
					status.elapsed = elapsed;

					// emit current position
					io.emit('api:controls:status', status);
				});
			} catch (ex) {}
		}, 1000);

		// setup on song end
		player.on('end', function() {
			console.log("song ended");
			if (status.state != PlayerState.stopped) {
				// check if queue.length > 0
				var db = new sqlite3.Database(__dirname + '/../library.db');
				db.serialize(function() {
					db.all("SELECT * FROM playlist", function(err, rows) {

						// find the row with our song that was just playing
						var index = 0;
						for (var i = 0; i<rows.length; i++) {
							if (status.file == rows[i].file) {
								index = i + 1;
								break;
							}
						}

						// increment the index;
						if (rows.length > 0 && rows.length >= (index + 1)) {
							try {
								player.stop();
							} catch (ex) {}

							var song = rows[index];
							if (song !== undefined) {
								// play index
								player.setFile(song.file);
								player.play();

								var parser = mm(fs.createReadStream(song.file), {duration: true}, function(err, data) {
									status.duration = data.duration;
									status.title = data.title;
									status.artist = data.artist;
									status.album = data.album;
								});

								status.file = song.file;
								status.state = PlayerState.playing;

								clearInterval(t);
								t = setInterval(function() {
									player.getTimePosition(function(elapsed) {
										status.elapsed = elapsed;

										// emit current position
										io.emit('api:controls:status', status);
									});
								}, 1000);
							}
						} else {
							// end of playlist
							player = null;
							status.state = PlayerState.idle;
							status.file = '';
						}

					});
				});

				db.close();
			}
		});
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
			|| status.state == PlayerState.paused
			&& player != null) {
				// stop music
			player.stop();
			player = null;

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

	/**
	 *	Seek command
	 */
	socket.on('api:controls:seek', function(time) {
		console.log("Seeking to " + time);
		player.seek(time);
	});
}

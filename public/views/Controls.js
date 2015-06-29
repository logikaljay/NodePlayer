var Controls = React.createClass({
  getInitialState: function() {
    return {
      state: 'idle',
      elapsed: 0,
      duration: 0,
      progress: 0,
      durationDisplay: "",
    }
  },

  prev: function() {

  },

  next: function() {

  },

  play: function() {
    socket.emit('api:controls:play',{
      file: './public/data/test.mp3'
    });
    this.setState({ state: 1 })
  },

  pause: function() {
    socket.emit('api:controls:pause');
    this.setState({ state: 2 })
  },

  stop: function() {
    socket.emit('api:controls:stop');
    this.setState({ state: 3, elapsed: 0, progress: 0 })
  },

  seek: function(event) {
    this.setState({ seekTo: event.target.value });
  },

  doSeek: function() {
    // seekTo is a percent, generate a timestamp
    var durationOfSong = this.state.duration;
    var seekPosition = durationOfSong / 100 * this.state.seekTo;

    // emit seek event
    socket.emit('api:controls:seek', seekPosition);
    this.setState({
      progress: this.state.seekTo
    });
  },

  refresh: function() {
    socket.emit('api:library:refresh');
  },

  componentDidMount: function() {
    socket.on('api:controls:status', function(progress) {
      var percent = 0;
      if (progress.state != "3") {
        percent = progress.elapsed * 100 / progress.duration;
      }

      this.setState({
        state: progress.state,
        progress: percent,
        elapsed: progress.elapsed,
        duration: progress.duration
      });
    }.bind(this));
  },

  render: function() {
    return (
      <div>
        <div className="row" style={{position:'fixed', bottom: 28, zIndex:2, width: '100%'}}>
          <p className="range-field">
            <input ref="progressbar" type="range" min="0" max="100" value={this.state.progress} onChange={this.seek} onMouseUp={this.doSeek} className="progressbar" />
          </p>
        </div>
        <footer className="page-footer" style={{position:'fixed', bottom: 0, width: '100%'}}>
          <div className="row controls">
            <div className="col s3 left-align">
              <a href="javascript:void(0);" onClick={this.refresh}><i className="material-icons medium">replay</i></a>
            </div>
            <div className="col s6 center-align">
              <i className="material-icons medium" onClick={this.prev}>skip_previous</i>
              <a href="javascript:void(0);" onClick={this.pause}><i className={"material-icons medium " + (this.state.state == "2" && "active")}>pause</i></a>
              <a href="javascript:void(0);" onClick={this.play}><i className={"material-icons medium " + (this.state.state == "1" && "active")}>play_arrow</i></a>
              <a href="javascript:void(0);" onClick={this.stop}><i className={"material-icons medium " + (this.state.state == "3" && "active")}>stop</i></a>
              <i className="material-icons medium" onClick={this.next}>skip_next</i>
            </div>
            <div className="col s3 right-align">
              <i className="material-icons medium">shuffle</i>
              <i className="material-icons medium">volume_up</i>
            </div>
          </div>
        </footer>
      </div>
    );
  }
});

var styles = {
  hidden: {
    display: 'none'
  }
};

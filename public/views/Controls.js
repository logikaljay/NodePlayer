var Controls = React.createClass({
  getInitialState() {
    return { state: 'idle', progress: 0 }
  },

  prev() {

  },

  next() {

  },

  play() {
    socket.emit('api:controls:play',{
      file: './public/data/test.mp3'
    });
  },

  pause() {
    socket.emit('api:controls:pause');
  },

  stop() {
    socket.emit('api:controls:stop');
  },

  componentDidMount() {
    socket.on('api:controls:status', function(progress) {
      console.log(progress);
    });
  },

  render() {

    return (
      <ul>
      <li>
          <a href="javascript:void(0);"
             onClick={this.prev}>
            Prev
           </a>
        </li>
        <li>
          <a href="javascript:void(0);"
             onClick={this.play}>
            Play
          </a>
        </li>
        <li>
          <a href="javascipt:void(0);"
             onClick={this.pause}>
            Pause
          </a>
        </li>
        <li>
          <a href="javascipt:void(0);"
             onClick={this.stop}>
            Pause
          </a>
        </li>
        <li>
          <a href="javascript:void(0);"
             onClick={this.next}>
            Next
          </a>
        </li>
      </ul>
    );

  }
});

var styles = {
  hidden: {
    display: 'none'
  }
};

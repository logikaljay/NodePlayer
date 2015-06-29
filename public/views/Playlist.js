var Playlist = React.createClass({
  getInitialProps() {
    return { data: [] };
  },
  getInitialState() {
    return { currentSong: "", state: 0 };
  },
  componentDidMount() {
    socket.on('api:controls:status', function(status) {
      this.setState({ currentSong: status.file, state: status.state })
    }.bind(this))
  },
  render() {
    var songs = this.props.data.map(function(song) {
      var active = (song.file == this.state.currentSong) && this.state.state != 3;
      return <Track ref={song.file} data={song} active={active} />;
    }.bind(this));

    return (
      <ul className="collection playlist">
        {songs}
      </ul>
    );
  }
});

var Track = React.createClass({
  getInitialState() {
    return { active: false };
  },
  play() {
    socket.emit('api:controls:stop');

    socket.emit('api:controls:play',{
      file: this.props.data.file
    });

    this.setState({ active: true });
  },

  render() {
    return (
      <li className={"collection-item avatar " + (this.props.active && "active")} onClick={this.play}>
        <i className="material-icons circle playlist-img">play_arrow</i>
        <span className="title">{this.props.data.title}</span>
        <p>{this.props.data.artist} <br />
           {this.props.data.album}
        </p>
      </li>
    );
  }
});

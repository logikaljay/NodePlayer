var Playlist = React.createClass({
  getInitialProps: function() {
    return { data: [] };
  },
  getInitialState: function() {
    return { currentSong: "", state: 0, songs: [] };
  },
  componentDidMount: function() {
    socket.on('api:playlist:list');
    socket.on('api:playlist:change', function(songs) {
      this.setState({songs: songs});
    }.bind(this));

    socket.on('api:controls:status', function(status) {
      this.setState({ currentSong: status.file, state: status.state })
    }.bind(this))
  },
  render: function() {
    var songs = this.state.songs.map(function(song) {
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
  getInitialState: function() {
    return { active: false };
  },
  play: function() {
    socket.emit('api:controls:stop');

    socket.emit('api:controls:play',{
      file: this.props.data.file
    });

    this.setState({ active: true });
  },

  render: function() {
    return (
      <li className={"collection-item avatar " + (this.props.active && "active")} onClick={this.play}>
        <i className="material-icons circle playlist-img">play_arrow</i>
        <span className="title">{this.props.data.title}</span>
        <p>{this.props.data.artist} <br />
           {this.props.data.album}
        </p>
        <a href="javascript:void(0);" className="secondary-content"><i className="material-icons">delete</i></a>
      </li>
    );
  }
});

var Playlist = React.createClass({
  getInitialProps: function() {
    return { data: [] };
  },

  getInitialState: function() {
    return { currentSong: "", state: 0, songs: [] };
  },

  componentDidMount: function() {
    socket.emit('api:playlist:list', function(songs) {
      this.setState({songs: songs});
    }.bind(this));
    socket.on('api:playlist:change', function(songs) {
      console.log("!!");
      console.log(songs);
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

  delete: function() {
    console.log("sending delete: " + this.props.data);
    socket.emit('api:playlist:remove', this.props.data);
  },

  render: function() {
    return (
      <li className={"collection-item avatar " + (this.props.active && "active")}>
        <a href="javascript:void(0);"><i className="material-icons circle playlist-img" onClick={this.play}>play_arrow</i></a>
        <span className="title">{this.props.data.title}</span>
        <p>{this.props.data.artist} <br />
           {this.props.data.album}
        </p>
        <a href="javascript:void(0);" className="secondary-content" onClick={this.delete}><i className="material-icons">delete</i></a>
      </li>
    );
  }
});

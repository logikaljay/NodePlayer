var Library = React.createClass({
  getInitialState: function() {
    return { songs: [] };
  },

  componentDidMount: function() {
    socket.emit('api:library:list');
    socket.on('api:library:list', function(songs) {
      console.log(songs);
      this.setState({ songs: songs });
    }.bind(this));

    var dropzone = new Dropzone(".dropzone", {
      url: "/upload",
      acceptedFiles: '.mp3',
    });
  },

  render: function() {
    var songs = this.state.songs.map(function(song) {
      return <LibrarySong song={song} />
    });
    return (
      <div action="/upload" className="dropzone" style={{overflow: 'auto', height: '70%'}}>
        <table className="table table-hover">
          <thead>
            <th>Artist</th>
            <th>Title</th>
            <th>Album</th>
            <th>Duration</th>
          </thead>
          <tbody>
            {songs}
          </tbody>
        </table>
      </div>
    );
  }
});

var LibrarySong = React.createClass({
  add: function() {
    socket.emit('api:playlist:add', this.props.song.file);
    console.log('adding: ' + this.props.song.file);
  },

  render: function() {
    return (
      <tr>
        <td>{this.props.song.artist}</td>
        <td>{this.props.song.title}</td>
        <td>{this.props.song.album}</td>
        <td>{this.props.song.duration}</td>
        <td><a href="javascript:void(0);" onClick={this.add}><i className="material-icons">add</i></a></td>
      </tr>
    );
  }
})

var Library = React.createClass({
  getInitialState() {
    return { songs: [] };
  },

  componentDidMount() {
    socket.emit('api:library:list');
    socket.on('api:library:list', function(songs) {
      this.setState({songs: songs});
    }.bind(this));
  },

  render() {
    return (
      <div>
        <Playlist data={this.state.songs} />
      </div>
    );
  }
});

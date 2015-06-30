var Library = React.createClass({
  getInitialState: function() {
    return { artists: [] };
  },

  componentDidMount: function() {
    socket.emit('api:library:artists', function(artists) {
      this.setState({ artists: artists });
    }.bind(this));
  },

  render: function() {
    var artists = this.state.artists.map(function(artist) {
      return <Artist artist={artist} />;
    });
    return (
      <ul className="collapsible" data-collapsible="accordion" style={{overflow: 'auto', height: '70%'}}>
        {artists}
      </ul>
    );
  }
});

var Artist = React.createClass({
  getInitialState: function() {
    return { songs: [] };
  },

  componentDidMount: function() {
    socket.emit('api:library:songs', this.props.artist, function(songs) {
      console.log(songs);
      this.setState({ songs: songs });
    }.bind(this));

    $(".collapsible").collapsible();
    $(function() {
      $(".collapsible").css({
        height:$(window).height() - 145
      })
    });
    $(window).on('resize', function() {
      $(".collapsible").css({
        height:$(window).height() - 145
      })
    });
  },

  render: function() {
    var songs = this.state.songs.map(function(song) {
      return <Song song={song} />;
    });
    return (
      <li>
        <div className="collapsible-header"><i className="material-icons">filter_drama</i>{this.props.artist}</div>
        <div className="collapsible-body">
          <div style={{marginLeft: '55px'}}>
            <table className="table table-hover" width="100%">
              <tbody>
                {songs}
              </tbody>
            </table>
          </div>
        </div>
      </li>
    );
  }
});

var Song = React.createClass({
  add: function() {
    socket.emit('api:playlist:add', this.props.song);
    console.log('adding: ' + this.props.song.file);
  },

  render: function() {
    return (
      <tr>
        <td>{this.props.song.title}</td>
        <td>{this.props.song.album}</td>
        <td><a href="javascript:void(0);" onClick={this.add}><i className="material-icons">add</i></a></td>
      </tr>
    );
  }
})

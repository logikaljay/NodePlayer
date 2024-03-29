var Library = React.createClass({
  getInitialState: function() {
    return { artists: [], refreshing: false };
  },

  componentDidMount: function() {
    socket.emit('api:library:artists', function(artists) {
      this.setState({ artists: artists });
    }.bind(this));

    socket.on('api:library:artists', function(artists) {
      this.setState({ artists: artists, refreshing: false });
    }.bind(this));

    socket.on('api:library:refreshing', function() {
      console.log("refreshing...");
      this.setState({ refreshing: true });
    }.bind(this));
  },

  render: function() {

    if (this.state.refreshing) {
      return (
        <div className="loading" style={{overflow:'auto', height: '70%'}}>Refreshing...</div>
      );
    } else {
      var artists = this.state.artists.map(function(artist) {
        return <Artist artist={artist} />;
      });
      return (
        <ul className="collapsible" data-collapsible="accordion" style={{overflow: 'auto', height: '70%'}}>
          {artists}
        </ul>
      );
    }
  }
});

var Artist = React.createClass({
  getInitialState: function() {
    return { songs: [] };
  },

  componentDidMount: function() {
    socket.emit('api:library:songs', this.props.artist, function(songs) {
      this.setState({ songs: songs });
    }.bind(this));

    socket.on('api:library:searchResult', function(songs) {
      var artistSongs = songs.filter(function(song) {
        return this.props.artist.artist == song.artist;
      }.bind(this));

      this.setState({songs: artistSongs});
    }.bind(this));

    $(".collapsible").collapsible();
    $(function() {
      $(".collapsible").css({
        height:$(window).height() - 142
      })
    });
    $(window).on('resize', function() {
      $(".collapsible").css({
        height:$(window).height() - 142
      })
    });
  },

  addAll: function() {
    socket.emit('api:playlist:add', this.state.songs);
  },

  render: function() {
    var songs = this.state.songs.map(function(song) {
      return <Song song={song} />;
    });

    var styles = {};
    if (this.state.songs.length == 0) {
      styles = { display: 'none' };
    }

    return (
      <li style={styles}>
        <div className="collapsible-header">
          {this.props.artist}
          <span className="secondary-content">
            <a href="javascript:void(0);" onClick={this.addAll}><i className="material-icons">add</i></a>
          </span>
        </div>
        <div className="collapsible-body">
          <div>
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
  getInitialState: function() {
    return { artError: false };
  },

  add: function() {
    socket.emit('api:playlist:add', this.props.song);
  },

  artError: function() {
    this.setState({ artError: true });
  },

  render: function() {
    var art;
    if (this.state.artError) {
      art = <td></td>;
    } else {
      var artUrl = "/art/small-" + this.props.song.artist + "-" + this.props.song.album + ".jpg";
      art = <td width="55"><img src={artUrl} onError={this.artError} /></td>;
    }
    return (
      <tr>
        {art}
        <td>{this.props.song.title}</td>
        <td>{this.props.song.album}</td>
        <td><a href="javascript:void(0);" onClick={this.add}><i className="material-icons">add</i></a></td>
      </tr>
    );
  }
})

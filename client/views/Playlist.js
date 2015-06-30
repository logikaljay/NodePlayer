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
      this.setState({songs: songs});
    }.bind(this));
    socket.on('api:controls:status', function(status) {
      this.setState({ currentSong: status.file, state: status.state })
    }.bind(this));

    $(function() {
      $(".playlist").css({
        height:$(window).height() - 142
      })
    });
    $(window).on('resize', function() {
      $(".playlist").css({
        height:$(window).height() - 142
      })
    });
  },

  render: function() {
    var songs = this.state.songs.map(function(song) {
      var active = (song.file == this.state.currentSong) && this.state.state != 3;
      return <Track ref={song.file} data={song} active={active} />;
    }.bind(this));

    return (
      <ul className="collection playlist z-depth-1" style={{overflow: 'auto', margin:'0 0 1rem 0'}}>
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
    socket.emit('api:playlist:remove', this.props.data);
  },

  artError: function() {
    this.setState({artError: true});
  },

  render: function() {
    var art;
    if (this.state.artError) {
      art = <i className="material-icons circle playlist-img">play_arrow</i>;
    } else {
      var artUrl = "/art/small-" + this.props.data.artist + "-" + this.props.data.album + ".jpg";
      art = <img src={artUrl} className="circle playlist-img" onError={this.artError} />;
    }
    return (
      <li className={"collection-item avatar " + (this.props.active && "active")}>
        <a href="javascript:void(0);" onClick={this.play}>
          {art}
        </a>
        <span className="title">{this.props.data.artist} - {this.props.data.title}</span>
        <p>{this.props.data.album}</p>
        <a href="javascript:void(0);" className="secondary-content" onClick={this.delete}><i className="material-icons">delete</i></a>
      </li>
    );
  }
});

var PlaylistControls = React.createClass({
  clear: function() {
    socket.emit('api:playlist:clear');
  },
  render: function() {
    return (
      <nav className="playlist-controls">
        <div className="nav-wrapper">
          <a href="javascript:void(0);" onClick={this.clear}><i className="material-icons large">clear</i></a>
        </div>
      </nav>
    );
  }
})

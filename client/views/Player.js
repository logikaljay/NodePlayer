var Player = React.createClass({
  getInitialState: function() {
    return { data: {} };
  },

  render: function() {
    return (
      <div action="/upload" className="dropzone">
        <div className="row">
          <div className="col s6" style={{paddingLeft:0}}>
            <Search />
            <Library />
          </div>
          <div className="col s6" style={{paddingRight:0,paddingTop:0}}>
            <PlaylistControls />
            <Playlist />
          </div>
        </div>
        <Controls />

        <Upload />
      </div>
    );
  }
});

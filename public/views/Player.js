var Player = React.createClass({
  getInitialState: function() {
    return { data: {} };
  },
  render: function() {
    return (
      <div>
        <div className="row">
          <div className="col s6" style={{padding:0}}>
            <Search />
            <Library />
          </div>
          <div className="col s6">
            <h5>Current playlist</h5>
            <Playlist />
          </div>
        </div>
        <Controls />
      </div>
    );
  }
});

var Player = React.createClass({
  getInitialState() {
    return { data: {} };
  },
  render: function() {
    return (
      <div>
        <div className="row">
          <Search />
        </div>
        <div className="row">
          <Library />
        </div>

        <Controls />
      </div>
    );
  }
});

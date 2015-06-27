var Player = React.createClass({
  getInitialState() {
    return { data: {} };
  },
  render: function() {
    return (
      <div>
        <Controls />
      </div>
    );
  }
});

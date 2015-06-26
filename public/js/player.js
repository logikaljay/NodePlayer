var socket = io();

var Player = React.createClass({
  getInitialState() {
    return { data: {} };
  },
  componentWillMount() {
    socket.emit('api:lsinfo', {path: ''});
    socket.on('api:lsinfo', function(data) {
      this.setState({ data: data });
    }.bind(this));
  },
  render: function() {
    return (
      <div>
        {JSON.stringify(this.state.data)}
        <Songs />
      </div>
    );
  }
});

var Songs = React.createClass({
  getInitialState() {
    return { songs: [] };
  },
  componentWillMount() {
    socket.emit('api:lsinfo', {path: ''});
    socket.on('api:lsinfo', function(data) {
      this.setState({ songs: data.content });
    }.bind(this));
  },
  render: function() {
    return (
      <ul>
        {this.state.songs.forEach(function(song) {
          <li>!!</li>
        })}
      </ul>
    );
  }
})

var Song = React.createClass({
  render: function() {
    return <li>!!</li>;
  }
})

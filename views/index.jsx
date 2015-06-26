var React = require('react');
var DefaultLayout = require('./layouts/default');
var io = require('socket.io-client');
var socket = io();

var HelloMessage = React.createClass({
  getInitialState: function() {
    socket.emit('api:status', function(err, res) {
      return { err: err, data: res };
    })
  },
  render: function() {
    getStatus();
    return (
      <DefaultLayout title={this.props.titile}>
        <div>Hello {this.state.data}</div>
      </DefaultLayout>
    );
  }
});

module.exports = HelloMessage;

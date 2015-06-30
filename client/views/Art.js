var Art = React.createClass({
  getInitialState() {
    return { url : "", loaded: false };
  },
  componentDidMount() {
    socket.emit('api:art:getlarge', {
      file: './public/data/test.mp3'
    });
    socket.on('api:art:get', function(url) {
      this.setState({
        url: url,
        loaded: true
      });
      console.log(url);
    }.bind(this));
  },
  render() {
    if (this.state.loaded) {
      return (
        <img src={this.state.url} />
      );
    } else {
      return (
        <div>Loading art...</div>
      );
    }
  }

})

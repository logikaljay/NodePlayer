var Search = React.createClass({
  getInitialState: function() {
    return { text: "" };
  },
  search: function() {
    socket.emit('api:library:search', this.state.text);
  },
  setSearch: function(event) {
    this.setState({ text: event.target.value })
  },
  render: function() {
    return (
      <nav>
        <form onSubmit={this.search}>
          <div className="nav-wrapper">
            <div className="input-field">
              <input id="search" type="search" onChange={this.setSearch} />
              <label htmlFor="search">
                <i className="material-icons">search</i>
              </label>
            </div>
          </div>
        </form>
      </nav>
    );
  }
});

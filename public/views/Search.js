var Search = React.createClass({
  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <div className="input-field">
            <input id="search" type="search" required />
            <label htmlFor="search">
              <i className="material-icons">search</i>
            </label>
          </div>
        </div>
      </nav>
    );
  }
});

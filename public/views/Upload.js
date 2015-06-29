var Upload = React.createClass({
  render: function() {
    return (
      <div>
        <a href="#upload" data-target="upload-trigger"></a>
        <div id="upload" className="modal bottom-sheet">
          <div className="modal-content">
            <h4>Modal Header</h4>
            <p>A bunch of text</p>
          </div>
          <div className="modal-footer">
            <a href="#!" className=" modal-action modal-close waves-effect waves-green btn-flat">Agree</a>
          </div>
        </div>
      </div>
    );
  }
});

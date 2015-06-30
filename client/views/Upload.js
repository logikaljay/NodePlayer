var Upload = React.createClass({
  getInitialState: function() {
    return { visible: false, files: [] };
  },

  componentDidMount: function() {
    var self = this;

    var dropzone = new Dropzone(".dropzone", {
      url: "/upload",
      acceptedFiles: '.mp3',
      clickable: false,
      addedfile: function(file) {
        var files = self.state.files;
        files.push(file);
        self.setState({ files: files });
      }
    });

    $(".modal-close").on('click', function() {
      $(".upload-trigger").closeModal();
      $("#upload")
        .animate({
          'bottom': '-100%'
        });

      this.setState({ visible: false });
    }.bind(this));

    dropzone.on('dragenter', function() {
      // show the upload window
      if (!this.state.visible) {
        $(".upload-trigger").openModal({
          dismissible: false, // Modal can be dismissed by clicking outside of the modal
          opacity: .5, // Opacity of modal background
          in_duration: 300, // Transition in duration
          out_duration: 200, // Transition out duration
        });
        $("#upload").show()
          .animate({
            'bottom': '0%'
          });
      }

      this.setState({ visible: true });
    }.bind(this));

    dropzone.on('queuecompleted', function() {
      $(".upload-trigger").closeModal();
      $("#upload")
        .animate({
          'bottom': '-100%'
        });
    });

    dropzone.on('uploadprogress', function(file, percent, bytessent) {
      var indexOfFile = this.state.files.indexOf(file);
      var files = this.state.files;
      files[indexOfFile] = file;
      this.setState({ files: files });
    }.bind(this));
  },

  render: function() {
    var files = this.state.files.map(function(file) {
      return <File data={file} />;
    });

    return (
      <div>
        <a href="#upload" className="upload-trigger" data-target="upload"></a>
        <div id="upload" className="modal bottom-sheet">
          <div className="modal-content">
            <h4>Upload files</h4>
            <ul className="collection">
              {files}
            </ul>
          </div>
          <div className="modal-footer">
            <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat">Hide</a>
          </div>
        </div>
      </div>
    );
  }
});

var File = React.createClass({
  render: function() {
    var status = this.props.data.upload.progress == 100 ? "green" : "red";
    var icon = this.props.data.upload.progress == 100 ? "done" : "file_upload";
    return (
      <li className="collection-item avatar">
        <i className={"material-icons circle " + status}>{icon}</i>
        <span className="title">{this.props.data.name}</span>
        <p>
          <progress max="100" value={this.props.data.upload.progress}></progress>
        </p>
        <a href="#!" className="secondary-content"><i className="material-icons">delete</i></a>
      </li>
    )
  }
})

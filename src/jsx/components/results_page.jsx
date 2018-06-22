import { ErrorMessage } from "./error_message.jsx";
import { NavBar } from "./navbar.jsx";
import { ScrollSpy } from "./scrollspy.jsx";
import { MethodHeader } from "./methodheader.jsx";

var React = require("react");

/**
 * ResultsPage is a reusable component to do the following in a standrdized way across methods/pages:
 *    1. Render the elements that will appear on every vision page:
 *      a. ScrollSpy
 *      b. MethodHeader
 *      c. ErrorMessage (this isn't implemented yet)
 *    2. Handle getting the data from a file/url and setting the data to state
 */
class ResultsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      json: null
    };
  }

  componentDidMount() {
    var self = this;
    this.enableBootstrapJavascript();
    this.setDataToState(this.props.data);
  }

  componentDidUpdate(prevProps, prevState) {
    var self = this;
    this.enableBootstrapJavascript();
    if (
      this.props.platform != "hyphyVision" &&
      self.props.data != prevState.json
    ) {
      this.setDataToState(self.props.data);
    }
    if (this.props.platform == "hyphyVision") {
      if (this.state.json == null || this.state.json != prevState.json) {
        this.setDataToState(self.props.data);
      }
    }
  }

  onFileChange = e => {
    var self = this;
    var files = e.target.files; // FileList object

    if (files.length == 1) {
      var f = files[0];
      var reader = new FileReader();
      reader.onload = (function(theFile) {
        return function(e) {
          var data = JSON.parse(this.result);
          self.setDataToState(data);
        };
      })(f);
      reader.readAsText(f);
    }
    e.preventDefault();
  };

  setDataToState = dataInput => {
    var self = this;
    // Decide if data is a URL or the results JSON
    if (typeof dataInput == "string") {
      var json;
      d3.json(dataInput, function(data) {
        json = data;
      });
    } else if (typeof dataInput == "object") {
      var json = dataInput;
    }
    self.setState({
      json: json
    });
  };

  enableBootstrapJavascript() {
    $("body").scrollspy({
      target: ".bs-docs-sidebar",
      offset: 50
    });
    $('[data-toggle="popover"]').popover();
    $(function() {
      $('[data-toggle="tooltip"]').tooltip();
    });
    $(".dropdown-toggle").dropdown();
  }

  render() {
    var self = this;
    if (!this.state.json) return <div />;
    return (
      <div>
        {this.props.platform == "hyphyVision" ? (
          <NavBar onFileChange={this.onFileChange} />
        ) : (
          ""
        )}
        <div className="container">
          <div className="row">
            <ScrollSpy info={self.props.scrollSpyInfo} />
            <div className="col-lg-12 col-xl-10">
              <div className="results">
                <ErrorMessage />
                <div id="summary-tab">
                  <MethodHeader
                    methodName={this.props.methodName}
                    input_data={this.state.json.input}
                    json={this.state.json}
                    fasta={this.props.fasta}
                    platform={this.props.platform}
                  />
                </div>
              </div>
              {React.createElement(this.props.children, {
                json: this.state.json
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ResultsPage.defaultProps = {
  fasta: false
};

module.exports.ResultsPage = ResultsPage;

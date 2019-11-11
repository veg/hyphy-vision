import { ErrorMessage } from "./error_message.jsx";
import { ScrollSpy } from "./scrollspy.jsx";
import { MethodHeader } from "./methodheader.jsx";
import { fastaParser } from "alignment.js";

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
      json: null,
      jsonPath: null,
      fastaPath: null,
      fasta: null
    };
  }

  componentDidMount() {
    var self = this;

    // Decide if data is a URL or the results JSON
    if (typeof this.props.data == "string") {
      self.setState({ jsonPath: this.props.data }); // Set the json path for comparing on updates to see if it's new data.
      d3.json(this.props.data, function(data) {
        self.setState({ json: data });
      });
    } else if (typeof this.props.data == "object") {
      self.setState({ json: self.props.data });
    }

    // Decide if data is a URL or the results JSON
    if (typeof this.props.fasta == "string") {
      self.setState({ fastaPath: this.props.fasta }); // Set the fasta path for comparing on updates to see if it's new data.
      d3.text(this.props.fasta, function(data) {
        let fasta_json = fastaParser(data);
        let values = _.values(fasta_json);
        values = _.filter(values, v => _.isObject(v) && _.values(v).length);
        self.setState({ fasta: values });
      });
    } else if (typeof this.props.fasta == "object") {
      self.setState({ fasta: self.props.fasta });
    }

    this.enableBootstrapJavascript();
  }

  componentDidUpdate(prevProps, prevState) {
    var self = this;
    // Decide if data is a URL or the results JSON
    var newData = this.state.json;
    if (typeof this.props.data == "string") {
      if (this.props.data != self.state.jsonPath) {
        d3.json(this.props.data, function(data) {
          //self.setState({ json: data });
          newData = data;
        });
      }
    } else if (typeof this.props.data == "object") {
      //self.setState({ json: self.props.data })
      newData = self.props.data;
    }

    if (newData != prevState.json) {
      self.setState({ json: newData });
    }

    //TODO: Handle new FASTA as well

    this.enableBootstrapJavascript();
  }

  setDataToState = data => {
    var self = this;
    self.setState({
      json: data
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

  renderSpinner() {
    return (
      <div>
        <i
          className="fa fa-spinner fa-spin"
          style={{
            position: "absolute",
            fontSize: "200px",
            color: "#00a99d",
            right: "45%",
            top: "50%"
          }}
        />
      </div>
    );
  }

  render() {
    var self = this;
    if (!this.state.json) return self.renderSpinner();
    return (
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
                  fasta={this.state.fasta}
                  originalFile={this.props.originalFile}
                  analysisLog={this.props.analysisLog}
                  partitionedData={this.props.partitionedData}
                />
              </div>
            </div>
            {React.createElement(this.props.children, {
              json: this.state.json,
              fasta: this.state.fasta
            })}
          </div>
        </div>
      </div>
    );
  }
}

ResultsPage.defaultProps = {
  fasta: false,
  originalFile: false,
  analysisLog: false
};

module.exports.ResultsPage = ResultsPage;

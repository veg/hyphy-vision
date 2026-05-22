import { ErrorBoundary } from "./error_boundary.jsx";
import { ErrorMessage } from "./error_message.jsx";
import { ScrollSpy } from "./scrollspy.jsx";
import { MethodHeader } from "./methodheader.jsx";

const React = require("react");

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} fetching ${url}`);
  }

  if (/\.gz($|\?)/.test(url)) {
    // The browser transparently decodes Content-Encoding: gzip responses, so
    // a .gz URL only needs manual decompression when the body still has the
    // gzip magic bytes (i.e. the server served it as an opaque application/gzip).
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    if (bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b) {
      const stream = new Blob([buffer])
        .stream()
        .pipeThrough(new DecompressionStream("gzip"));
      return JSON.parse(await new Response(stream).text());
    }
    return JSON.parse(new TextDecoder().decode(buffer));
  }

  return response.json();
}

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
      fasta: null,
    };
  }

  componentDidMount() {
    var self = this;

    // Deep-link query parameter. `json` is the preferred name; `resultsUrl` is
    // accepted for backward compatibility with existing share links.
    let queryParams = new URLSearchParams(location.search);
    let queryUrl =
      queryParams.get("json") || queryParams.get("resultsUrl");

    if (typeof queryUrl == "string") {
      self.setState({ jsonPath: queryUrl });

      fetchJson(queryUrl)
        .then((data) => self.setState({ json: data }))
        .catch((err) => console.error(err));
    } else if (typeof this.props.data == "string") {
      // Decide if data is a URL or the results JSON

      self.setState({ jsonPath: this.props.data });

      fetchJson(this.props.data)
        .then((data) => self.setState({ json: data }))
        .catch((err) => console.error(err));
    } else if (typeof this.props.data == "object") {
      self.setState({ json: self.props.data });
    }

    if (typeof this.props.fasta == "string") {
      self.setState({ fasta: self.props.fasta });
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
        fetchJson(this.props.data)
          .then((data) => {
            newData = data;
          })
          .catch((err) => console.error(err));
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

  setDataToState = (data) => {
    var self = this;
    self.setState({
      json: data,
    });
  };

  enableBootstrapJavascript() {
    $("body").scrollspy({
      target: ".bs-docs-sidebar",
      offset: 50,
    });
    $('[data-toggle="popover"]').popover();
    $(function () {
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
            top: "50%",
          }}
        />
      </div>
    );
  }

  render() {
    var self = this;

    if (!this.state.json) {
      return self.renderSpinner();
    }
    return (
      <div className="container">
        <div className="row">
          <ScrollSpy info={self.props.scrollSpyInfo} />
          <div className="col-lg-12 col-xl-10">
            <div className="results">
              <ErrorMessage />
              {this.props.displaySummary && (
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
              )}
            </div>
            <ErrorBoundary>
              {React.createElement(this.props.children, {
                json: this.state.json,
                fasta: this.state.fasta,
                originalFile: this.props.originalFile,
                analysisLog: this.props.analysisLog,
                partitionedData: this.props.partitionedData,
              })}
            </ErrorBoundary>
          </div>
        </div>
      </div>
    );
  }
}

ResultsPage.defaultProps = {
  fasta: false,
  originalFile: false,
  analysisLog: false,
  displaySummary: true,
};

export { ResultsPage };

var React = require("react"),
  ReactDOM = require("react-dom"),
  d3 = require("d3");

import { NavBar } from "./components/navbar.jsx";
import { ScrollSpy } from "./components/scrollspy.jsx";
import { InputInfo } from "./components/input_info.jsx";
import { ErrorMessage } from "./components/error_message.jsx";
import { Header } from "./components/header.jsx";

class TemplateResults extends React.Component {
  render() {
    if (!this.props.data) return <div />;
    return (
      <div className="row" id="summary-tab">
        <div className="col-md-12">
          <h3 className="list-group-item-heading">
            <span className="summary-method-name">HyPhy Vision Template</span>
            <br />
            <span className="results-summary">results summary</span>
          </h3>
        </div>
        <div className="col-md-12">
          <InputInfo input_data={this.props.data} />
        </div>
        <div className="col-md-12">
          <div className="main-result">
            <p>
              This will serve as a template for Hyphy-Vision/Datamonkey results
              visualizations, as well as notes on useful design patterns and
              best practices to allow rapid prototyping of new analyses.
            </p>
            <hr />
            <p>
              <small>
                See{" "}
                <a href="http://hyphy.org/methods/selection-methods/#absrel">
                  here
                </a>{" "}
                for more information about this method.
                <br />Please cite{" "}
                <a
                  href="http://www.ncbi.nlm.nih.gov/pubmed/25697341"
                  id="summary-pmid"
                  target="_blank"
                >
                  PMID 123456789
                </a>{" "}
                if you use this result in a publication, presentation, or other
                scientific work.
              </small>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

class ReactConventions extends React.Component {
  render() {
    var popover = `<ul>
      <li>
        This is an example of a popover, which will describe the contents of the section that
        correspond to this header.
      </li>
    </ul>`;

    return (
      <div className="row" id="react-tab">
        <div className="col-md-12">
          <Header title="React Conventions" popover={popover} />
          <p className="description">
            Components initially render with no data present, which must be
            accounted for. An API call is made in the componentDidMount method
            of the Results component. All data will be stored in the state of
            this component, and relevant pieces will be passed down to child
            components as props. The state can be changed upon loading a file.
          </p>
        </div>
      </div>
    );
  }
}

class Template extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
    this.onFileChange = this.onFileChange.bind(this);
  }
  componentDidMount() {
    var self = this;
    d3.json(this.props.url, function(data) {
      self.setState({
        data: data
      });
    });
  }
  componentDidUpdate(prevProps, prevState) {
    $("body").scrollspy({
      target: ".bs-docs-sidebar",
      offset: 50
    });
    $('[data-toggle="popover"]').popover();
  }
  onFileChange(e) {
    var self = this,
      files = e.target.files; // FileList object

    if (files.length == 1) {
      var f = files[0],
        reader = new FileReader();

      reader.onload = (function(theFile) {
        return function(e) {
          var data = JSON.parse(this.result);
          self.setState({ data: data });
        };
      })(f);
      reader.readAsText(f);
    }
    e.preventDefault();
  }
  render() {
    var self = this,
      scrollspy_info = [
        { label: "summary", href: "summary-tab" },
        { label: "react", href: "react-tab" }
      ];
    return (
      <div>
        <NavBar onFileChange={this.onFileChange} />
        <div className="container">
          <div className="row">
            <ScrollSpy info={scrollspy_info} />
            <div className="col-sm-10" id="results">
              <ErrorMessage />
              <TemplateResults
                data={self.state.data ? self.state.data.input_data : null}
              />
              <ReactConventions />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function render_template(url, element) {
  ReactDOM.render(<Template url={url} />, document.getElementById(element));
}

module.exports = render_template;

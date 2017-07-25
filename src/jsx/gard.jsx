var React = require('react'),
  ReactDOM = require("react-dom"),
  d3 = require("d3");

import { NavBar } from "./components/navbar.jsx";
import { ScrollSpy } from "./components/scrollspy.jsx";
import { InputInfo } from "./components/input_info.jsx";
import { ErrorMessage } from "./components/error_message.jsx";
import { Header } from "./components/header.jsx";


function GARDResults(props){
    if(!props.data) return <div></div>;
    return (<div className="row" id="summary-tab">
      <div className="col-md-12">
        <h3 className="list-group-item-heading">
          <span className="summary-method-name">
            Genetic Algorithm Recombination Detection
          </span>
          <br />
          <span className="results-summary">results summary</span>
        </h3>
      </div>
      <div className="col-md-12">
        <InputInfo input_data={props.data.input_data} />
      </div>
      <div className="col-md-12">
        <div className="main-result">
          <p>
            GARD <strong className="hyphy-highlight">found evidence</strong> of {props.data.lastImprovedBPC} recombination breakpoints.
          </p>
          <hr />
          <p>
            <small>
              See{" "}
              <a href="http://hyphy.org/methods/selection-methods/#gard">
                here
              </a>{" "}
              for more information about this method.
              <br />Please cite{" "}
              <a
                href="http://www.ncbi.nlm.nih.gov/pubmed/16818476"
                id="summary-pmid"
                target="_blank"
              >
                PMID 16818476
              </a>{" "}
              if you use this result in a publication, presentation, or other
              scientific work.
            </small>
          </p>
        </div>
      </div>

    </div>);
}

class GARD extends React.Component {
  constructor(props){
    super(props);
    this.state = {data: null};
    this.onFileChange = this.onFileChange.bind(this);
  }
  componentDidMount(){
    var self = this;
    d3.json(this.props.url, function(data){
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
  onFileChange(e){
    var self = this,
      files = e.target.files; // FileList object

    if (files.length == 1) {
      var f = files[0],
        reader = new FileReader();

      reader.onload = (function(theFile) {
        return function(e) {
          var data = JSON.parse(this.result);
          self.setState({data: data});
        };
      })(f);
      reader.readAsText(f);
    }
    e.preventDefault();

  }
  render(){
    var self = this,
      scrollspy_info = [
        { label: "summary", href: "summary-tab" },
        { label: "details", href: "details-tab" },
        { label: "plots", href: "plots-tab" },
        { label: "trees", href: "trees-tab" },
      ];
    return (<div>
      <NavBar onFileChange={this.onFileChange} />
      <div className="container">
        <div className="row">
          <ScrollSpy info={scrollspy_info} />
          <div className="col-sm-10" id="results">
            <ErrorMessage />
            <GARDResults data={this.state.data} />
          </div>
        </div>
      </div>
    </div>);
  }
}

function render_gard(url, element) {
  ReactDOM.render(<GARD url={url} />, document.getElementById(element));
}

module.exports = render_gard


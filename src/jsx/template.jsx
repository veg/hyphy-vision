var React = require('react'),
  ReactDOM = require("react-dom"),
  d3 = require("d3");

import { NavBar } from "./components/navbar.jsx";
import { ScrollSpy } from "./components/scrollspy.jsx";
import { InputInfo } from "./components/input_info.jsx";


class TemplateResults extends React.Component {
  render(){
    if(!this.props.data) return <div></div>;
    return (<div className="row" id="summary-tab">
      <div className="col-md-12">
        <h3 className="list-group-item-heading">
          <span className="summary-method-name">
            HyPhy Vision Template
          </span>
          <br />
          <span className="results-summary">results summary</span>
        </h3>
      </div>
      <div className="col-md-12">
        <InputInfo input_data={this.props.data}/>
      </div>
    </div>);
  }
}

class Template extends React.Component {
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
        { label: "jsx", href: "jsx-tab" },
        { label: "html", href: "html-tab" }
      ];
    return (<div>
      <NavBar onFileChange={this.onFileChange} />
      <div className="container">
        <div className="row">
          <ScrollSpy info={scrollspy_info} />
          <div className="col-sm-10" id="results">
            <TemplateResults data={self.state.data ? self.state.data.input_data : null} />
          </div>
        </div>
      </div>
    </div>);
  }
}

function render_template(url, element) {
  ReactDOM.render(<Template url={url} />, document.getElementById(element));
}

module.exports = render_template


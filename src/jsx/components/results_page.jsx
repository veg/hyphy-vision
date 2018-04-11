import { ErrorMessage } from "./error_message.jsx";
import { NavBar } from './navbar.jsx';
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

  constructor(props){
    super(props);
    this.state = {
      json: null,
    }
  };

  componentDidMount(){
    var self = this;
    // Decide if data is a URL or the results JSON
    if(typeof(this.props.data) == "string") {
      d3.json(this.props.data, function(data) {
        self.setDataToState(data);
      });
    } else if (typeof(this.props.data) == "object") {
      self.setDataToState(self.props.data);
    };
    this.enableBootstrapJavascript();
  };

  componentDidUpdate(prevProps, prevState) {
    this.enableBootstrapJavascript();
  }
 
  onFileChange = (e) => {
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

  setDataToState(data) {
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
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    });
    $('.dropdown-toggle').dropdown();
  }

  render() {
    var self = this;

    if(!this.state.json) return <div></div>;
    return(
      <div>
        {this.props.hyphy_vision ? <NavBar onFileChange={this.onFileChange} /> : ''}
        <div className="container">
          <ScrollSpy info={self.props.scrollSpyInfo} />
          <div className="col-md-12 col-lg-10">
            <div className="results">
              <ErrorMessage />
              <div id="summary-tab">
                <MethodHeader
                  methodName={self.props.methodName}
                  input_data={this.state.json.input}
                  json={this.state.json}
                  hyphy_vision={this.props.hyphy_vision}
                />
              </div>
            </div>
            {React.createElement(this.props.children, { json: this.state.json})}
          </div>
        </div>
      </div>
    );
  };
};

module.exports.ResultsPage = ResultsPage;

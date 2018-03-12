import { ErrorMessage } from "./error_message.jsx";
import { NavBar } from './navbar.jsx';
import { ScrollSpy } from "./scrollspy.jsx";
import { MethodHeader } from "./methodheader.jsx";

var React = require("react");

/**
 * ResultsPage is a WIP attempt to create a reusable component to do the following:
 *    1. Render the elements that will appear on every vision page:
 *      a. ScrollSpy
 *      b. MethodHeader
 *      c. TODO: MainResultSummary (not sure if this should go in the ResultsPage component or in each method component)
 *    2. Handle getting the data from a file/url and setting the data to state
 *    3. Serve as the container for the state that multiple subcomponents will share (note: This currently isn't implemented; the state that multiple graphs/tables share is stored in the method component) 
 *    TODO: Do we still need the ErrorMessage component? and if so, how can we test to make sure it still works?
 *    TODO: There seem to be more div tags than needed (not in this component but just in general) there may have been some alignment achived by nested <div classname="row"> tags and/or results tags which is not desired
 *    TODO: The navBar offset is not quite as big as it should be. The offset is set in app.jsx but may be relying on some div tags that had been removed because they were duplicative.
 *    TODO: The method specific info (initial data, scrollspy_info and method_name) are currently inputed as props in app.js. It may be best to just have these all in a json object in this component and the only prop that is passed is which method it is.
 */
class ResultsPage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      json: null
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
  };

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

 render() {
    if(!this.state.json) return <div></div>;
    return(
      <div>
        {this.props.hyphy_vision ? <NavBar onFileChange={this.onFileChange} /> : ''}
        <div className="container">
          <ScrollSpy info={this.props.scrollspy_info} />
          <div className="col-md-12 col-lg-10">
            <div className="results">
              <ErrorMessage />
              <div id="summary-tab">
                <MethodHeader
                  methodName={this.props.methodName}
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

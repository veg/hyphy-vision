var React = require('react'),
    ReactDOM = require('react-dom');

var InputInfo = React.createClass({

  getInitialState(){
    return {
      input_data: {}
    };
  },

  componentWillReceiveProps(nextProps){
    this.setState({
      input_data: nextProps.input_data
    });
  },

  render(){
    return(
      <div id="data-circle">
        <div id="data-text">
          <h5 className="hyphy-highlight">INPUT DATA</h5><br/>
          <p>{this.state.input_data.filename}</p><br/>
          <p><span className="hyphy-highlight">{this.state.input_data.sequences}</span> sequences</p><br/>
          <p><span className="hyphy-highlight">{this.state.input_data.branches}</span> branches</p><br/>
          <p><span className="hyphy-highlight">{this.state.input_data.variants}</span> variants</p><br/>
        </div>
      </div>
    )
  }

});

module.exports.InputInfo = InputInfo;

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
      <div id="input-info">
        <span className="hyphy-highlight">INPUT DATA</span> <span className="divider">/</span>
        <a href="#">{this.state.input_data.filename}</a> <span className="divider">/</span>
        <span className="hyphy-highlight">{this.state.input_data.sequences}</span> sequences <span className="divider">/</span>
        <span className="hyphy-highlight">{this.state.input_data.sites}</span> sites
      </div>
    )
  }

});

module.exports.InputInfo = InputInfo;

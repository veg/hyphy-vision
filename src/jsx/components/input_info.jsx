var React = require('react');

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
        <h5 className="hyphy-highlight">INPUT DATA</h5><br/>
        <p>{this.state.input_data.filename}</p><br/>
        <p><span className="hyphy-highlight">{this.state.input_data.sequences}</span> sequences</p><br/>
        <p><span className="hyphy-highlight">{this.state.input_data.sites}</span> sites</p><br/>
      </div>
    )
  }

});

module.exports.InputInfo = InputInfo;

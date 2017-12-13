import React from 'react';
import ReactDOM from 'react-dom';

const d3 = require('d3');

require("font-awesome/css/font-awesome.css");
require('./application.less');
require('./hyphyvision.css');
require('./fade/FADE.css');

require('bootstrap');
require('./datamonkey/datamonkey.js');

class Hello extends React.Component {
  constructor(props){
    super(props);
    this.state = {data: null};
  }
  componentDidMount(){
    var self = this,
      // SDS, 12/12/17: This is a quick hack that needs a better solution...
      // Use this path for web development
      path = '/methods/absrel/data/ABSREL.json';
      // Use this path when testing electron
      // path = '/Users/stephenshank/Documents/hyphy-vision/methods/absrel/data/ABSREL.json';
    d3.json(path, (error, data) => {
      self.setState({data: data});
    });
  }
  render() {
    return (<div>
      <h1>HyPhy Vision</h1>
      <p>A webpack-dev-server and React from scratch</p>
      {this.state.data ? JSON.stringify(this.state.data) : null}
    </div>);
  }
}

ReactDOM.render(
  <Hello />,
  document.body.appendChild(document.createElement('div'))
);


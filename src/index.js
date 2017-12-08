import React from 'react';
import ReactDOM from 'react-dom';

const d3 = require('d3');

class Hello extends React.Component {
  constructor(props){
    super(props);
    this.state = {data: null};
  }
  componentDidMount(){
    var self = this;
    d3.json('/methods/absrel/data/ABSREL.json', (error, data) => {
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


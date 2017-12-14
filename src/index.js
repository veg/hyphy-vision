import React from 'react';
import ReactDOM from 'react-dom';

import { BSREL } from './jsx/absrel.jsx';
import { BUSTED } from './jsx/busted.jsx';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';


require("font-awesome/css/font-awesome.css");
require('./application.less');
require('./hyphyvision.css');
require('./fade/FADE.css');
require('bootstrap');
require('./datamonkey/datamonkey.js');

const base = '/Users/stephenshank/Documents/hyphy-vision/';

const HVABSREL = () => (
  <BSREL url={'methods/absrel/data/ABSREL.json'} hyphy_vision />
);

const HVBUSTED = () => (
  <BUSTED url={'/methods/busted/data/BUSTED.json'} hyphy_vision />
);

const Home = () => (
  <div>
    <h1>Home</h1>
    <a href="/absrel">aBSREL</a>
    <a href="/busted">BUSTED</a>
  </div>
);

const HyphyVision = () => (
  <Router>
    <div>
      <Route exact path="/" component={Home}/>
      <Route path="/absrel" component={HVABSREL}/>
      <Route path="/busted" component={HVBUSTED}/>
    </div>
  </Router>
);

ReactDOM.render(
  <HyphyVision />,
  document.body.appendChild(document.createElement('div'))
);


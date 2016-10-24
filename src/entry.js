window.$ = window.JQuery = $;

import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
require("font-awesome-webpack");
require('./hyphy-vision.css');

require('bootstrap');
require('./datamonkey/datamonkey.js');

// Bundle exports under hyphyvision
require('./jsx/absrel.jsx');
var busted = require('./jsx/busted.jsx');
require('./jsx/relax.jsx');
require('./jsx/slac.jsx');

// Create new hyphy-vision export
window.busted = busted;

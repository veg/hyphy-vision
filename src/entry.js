window.$ = window.JQuery = $;

import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
require("font-awesome/css/font-awesome.css");
require('./hyphy-vision.css');

require('bootstrap');
require('./datamonkey/datamonkey.js');

// Bundle exports under hyphyvision
require('./jsx/slac.jsx');

var absrel = require('./jsx/absrel.jsx');
var busted = require('./jsx/busted.jsx');
var relax = require('./jsx/relax.jsx');

// Create new hyphy-vision export
window.absrel = absrel;
window.busted = busted;
window.relax = relax;

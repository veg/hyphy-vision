window.jQuery = window.$ = $; 
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
require("font-awesome/css/font-awesome.css");
require('./hyphy-vision.css');
require('./fade/FADE.css');

require('bootstrap');
require('./datamonkey/datamonkey.js');

var absrel = require('./jsx/absrel.jsx'),
    busted = require('./jsx/busted.jsx'),
    fade = require('./fade/FADE.js'),
    fade_summary = require('./jsx/fade_summary.jsx'),
    fel = require('./jsx/fel.jsx'),
    relax = require('./jsx/relax.jsx'),
    slac = require('./jsx/slac.jsx');

// Create new hyphy-vision export
window.absrel = absrel;
window.busted = busted;
window.fade = fade;
window.fade_summary = fade_summary;
window.relax = relax;
window.slac = slac;
window.fel = fel;

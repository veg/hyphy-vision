window.jQuery = window.$ = $; 

require("font-awesome/css/font-awesome.css");
require('./application.less');
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
    slac = require('./jsx/slac.jsx'),
    meme = require('./jsx/meme.jsx'),
    template = require('./jsx/template.jsx');

// Create new hyphy-vision export
window.absrel = absrel;
window.busted = busted;
window.fade = fade;
window.fade_summary = fade_summary;
window.fel = fel;
window.meme = meme;
window.relax = relax;
window.slac = slac;
window.template = template

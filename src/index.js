require("font-awesome/css/font-awesome.css");
require('./application.less');
require('./hyphyvision.css');
require('./fade/FADE.css');
require('bootstrap');
require('./datamonkey/datamonkey.js');

import render_app from './jsx/app.jsx';

render_app();

var absrel = require('./jsx/absrel.jsx'),
    busted = require('./jsx/busted.jsx'),
    fade = require('./fade/FADE.js'),
    fade_summary = require('./jsx/fade_summary.jsx'),
    fel = require('./jsx/fel.jsx'),
    prime = require('./jsx/prime.jsx'),
    relax = require('./jsx/relax.jsx'),
    slac = require('./jsx/slac.jsx'),
    fubar = require('./jsx/fubar.jsx'),
    meme = require('./jsx/meme.jsx'),
    gard = require('./jsx/gard.jsx'),
    template = require('./jsx/template.jsx');

// Create new hyphy-vision export
window.absrel = absrel.hv;
window.busted = busted.hv;
window.fade = fade;
window.fade_summary = fade_summary;
window.fel = fel.hv;
window.prime = prime;
window.meme = meme.hv;
window.relax = relax.hv;
window.slac = slac.hv;
window.fubar = fubar.hv;
window.gard = gard.hv;
window.template = template

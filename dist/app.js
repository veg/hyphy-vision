webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(14);


/***/ },

/***/ 14:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';
	
	var _bootstrap = __webpack_require__(18);
	
	var _bootstrap2 = _interopRequireDefault(_bootstrap);
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
	window.$ = window.JQuery = $;
	
	__webpack_require__(27);
	__webpack_require__(38);
	
	__webpack_require__(40);
	__webpack_require__(53);
	
	// Bundle exports under hyphyvision
	__webpack_require__(59);
	var busted = __webpack_require__(223);
	__webpack_require__(235);
	__webpack_require__(237);
	
	// Create new hyphy-vision export
	window.busted = busted;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ },

/***/ 18:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 27:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(28);


/***/ },

/***/ 28:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(29);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(37)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./node_modules/css-loader/index.js!./../less-loader/index.js!./font-awesome-styles.loader.js!./font-awesome.config.js", function() {
				var newContent = require("!!./node_modules/css-loader/index.js!./../less-loader/index.js!./font-awesome-styles.loader.js!./font-awesome.config.js");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 29:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(30)();
	// imports
	
	
	// module
	exports.push([module.id, ".fa-border {\n  padding: .2em .25em .15em;\n  border: solid 0.08em #eee;\n  border-radius: .1em;\n}\n.fa-pull-left {\n  float: left;\n}\n.fa-pull-right {\n  float: right;\n}\n.fa.fa-pull-left {\n  margin-right: .3em;\n}\n.fa.fa-pull-right {\n  margin-left: .3em;\n}\n/* Deprecated as of 4.4.0 */\n.pull-right {\n  float: right;\n}\n.pull-left {\n  float: left;\n}\n.fa.pull-left {\n  margin-right: .3em;\n}\n.fa.pull-right {\n  margin-left: .3em;\n}\n.fa {\n  display: inline-block;\n  font: normal normal normal 14px/1 FontAwesome;\n  font-size: inherit;\n  text-rendering: auto;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.fa-fw {\n  width: 1.28571429em;\n  text-align: center;\n}\n/* Font Awesome uses the Unicode Private Use Area (PUA) to ensure screen\n   readers do not read off random characters that represent icons */\n.fa-glass:before {\n  content: \"\\F000\";\n}\n.fa-music:before {\n  content: \"\\F001\";\n}\n.fa-search:before {\n  content: \"\\F002\";\n}\n.fa-envelope-o:before {\n  content: \"\\F003\";\n}\n.fa-heart:before {\n  content: \"\\F004\";\n}\n.fa-star:before {\n  content: \"\\F005\";\n}\n.fa-star-o:before {\n  content: \"\\F006\";\n}\n.fa-user:before {\n  content: \"\\F007\";\n}\n.fa-film:before {\n  content: \"\\F008\";\n}\n.fa-th-large:before {\n  content: \"\\F009\";\n}\n.fa-th:before {\n  content: \"\\F00A\";\n}\n.fa-th-list:before {\n  content: \"\\F00B\";\n}\n.fa-check:before {\n  content: \"\\F00C\";\n}\n.fa-remove:before,\n.fa-close:before,\n.fa-times:before {\n  content: \"\\F00D\";\n}\n.fa-search-plus:before {\n  content: \"\\F00E\";\n}\n.fa-search-minus:before {\n  content: \"\\F010\";\n}\n.fa-power-off:before {\n  content: \"\\F011\";\n}\n.fa-signal:before {\n  content: \"\\F012\";\n}\n.fa-gear:before,\n.fa-cog:before {\n  content: \"\\F013\";\n}\n.fa-trash-o:before {\n  content: \"\\F014\";\n}\n.fa-home:before {\n  content: \"\\F015\";\n}\n.fa-file-o:before {\n  content: \"\\F016\";\n}\n.fa-clock-o:before {\n  content: \"\\F017\";\n}\n.fa-road:before {\n  content: \"\\F018\";\n}\n.fa-download:before {\n  content: \"\\F019\";\n}\n.fa-arrow-circle-o-down:before {\n  content: \"\\F01A\";\n}\n.fa-arrow-circle-o-up:before {\n  content: \"\\F01B\";\n}\n.fa-inbox:before {\n  content: \"\\F01C\";\n}\n.fa-play-circle-o:before {\n  content: \"\\F01D\";\n}\n.fa-rotate-right:before,\n.fa-repeat:before {\n  content: \"\\F01E\";\n}\n.fa-refresh:before {\n  content: \"\\F021\";\n}\n.fa-list-alt:before {\n  content: \"\\F022\";\n}\n.fa-lock:before {\n  content: \"\\F023\";\n}\n.fa-flag:before {\n  content: \"\\F024\";\n}\n.fa-headphones:before {\n  content: \"\\F025\";\n}\n.fa-volume-off:before {\n  content: \"\\F026\";\n}\n.fa-volume-down:before {\n  content: \"\\F027\";\n}\n.fa-volume-up:before {\n  content: \"\\F028\";\n}\n.fa-qrcode:before {\n  content: \"\\F029\";\n}\n.fa-barcode:before {\n  content: \"\\F02A\";\n}\n.fa-tag:before {\n  content: \"\\F02B\";\n}\n.fa-tags:before {\n  content: \"\\F02C\";\n}\n.fa-book:before {\n  content: \"\\F02D\";\n}\n.fa-bookmark:before {\n  content: \"\\F02E\";\n}\n.fa-print:before {\n  content: \"\\F02F\";\n}\n.fa-camera:before {\n  content: \"\\F030\";\n}\n.fa-font:before {\n  content: \"\\F031\";\n}\n.fa-bold:before {\n  content: \"\\F032\";\n}\n.fa-italic:before {\n  content: \"\\F033\";\n}\n.fa-text-height:before {\n  content: \"\\F034\";\n}\n.fa-text-width:before {\n  content: \"\\F035\";\n}\n.fa-align-left:before {\n  content: \"\\F036\";\n}\n.fa-align-center:before {\n  content: \"\\F037\";\n}\n.fa-align-right:before {\n  content: \"\\F038\";\n}\n.fa-align-justify:before {\n  content: \"\\F039\";\n}\n.fa-list:before {\n  content: \"\\F03A\";\n}\n.fa-dedent:before,\n.fa-outdent:before {\n  content: \"\\F03B\";\n}\n.fa-indent:before {\n  content: \"\\F03C\";\n}\n.fa-video-camera:before {\n  content: \"\\F03D\";\n}\n.fa-photo:before,\n.fa-image:before,\n.fa-picture-o:before {\n  content: \"\\F03E\";\n}\n.fa-pencil:before {\n  content: \"\\F040\";\n}\n.fa-map-marker:before {\n  content: \"\\F041\";\n}\n.fa-adjust:before {\n  content: \"\\F042\";\n}\n.fa-tint:before {\n  content: \"\\F043\";\n}\n.fa-edit:before,\n.fa-pencil-square-o:before {\n  content: \"\\F044\";\n}\n.fa-share-square-o:before {\n  content: \"\\F045\";\n}\n.fa-check-square-o:before {\n  content: \"\\F046\";\n}\n.fa-arrows:before {\n  content: \"\\F047\";\n}\n.fa-step-backward:before {\n  content: \"\\F048\";\n}\n.fa-fast-backward:before {\n  content: \"\\F049\";\n}\n.fa-backward:before {\n  content: \"\\F04A\";\n}\n.fa-play:before {\n  content: \"\\F04B\";\n}\n.fa-pause:before {\n  content: \"\\F04C\";\n}\n.fa-stop:before {\n  content: \"\\F04D\";\n}\n.fa-forward:before {\n  content: \"\\F04E\";\n}\n.fa-fast-forward:before {\n  content: \"\\F050\";\n}\n.fa-step-forward:before {\n  content: \"\\F051\";\n}\n.fa-eject:before {\n  content: \"\\F052\";\n}\n.fa-chevron-left:before {\n  content: \"\\F053\";\n}\n.fa-chevron-right:before {\n  content: \"\\F054\";\n}\n.fa-plus-circle:before {\n  content: \"\\F055\";\n}\n.fa-minus-circle:before {\n  content: \"\\F056\";\n}\n.fa-times-circle:before {\n  content: \"\\F057\";\n}\n.fa-check-circle:before {\n  content: \"\\F058\";\n}\n.fa-question-circle:before {\n  content: \"\\F059\";\n}\n.fa-info-circle:before {\n  content: \"\\F05A\";\n}\n.fa-crosshairs:before {\n  content: \"\\F05B\";\n}\n.fa-times-circle-o:before {\n  content: \"\\F05C\";\n}\n.fa-check-circle-o:before {\n  content: \"\\F05D\";\n}\n.fa-ban:before {\n  content: \"\\F05E\";\n}\n.fa-arrow-left:before {\n  content: \"\\F060\";\n}\n.fa-arrow-right:before {\n  content: \"\\F061\";\n}\n.fa-arrow-up:before {\n  content: \"\\F062\";\n}\n.fa-arrow-down:before {\n  content: \"\\F063\";\n}\n.fa-mail-forward:before,\n.fa-share:before {\n  content: \"\\F064\";\n}\n.fa-expand:before {\n  content: \"\\F065\";\n}\n.fa-compress:before {\n  content: \"\\F066\";\n}\n.fa-plus:before {\n  content: \"\\F067\";\n}\n.fa-minus:before {\n  content: \"\\F068\";\n}\n.fa-asterisk:before {\n  content: \"\\F069\";\n}\n.fa-exclamation-circle:before {\n  content: \"\\F06A\";\n}\n.fa-gift:before {\n  content: \"\\F06B\";\n}\n.fa-leaf:before {\n  content: \"\\F06C\";\n}\n.fa-fire:before {\n  content: \"\\F06D\";\n}\n.fa-eye:before {\n  content: \"\\F06E\";\n}\n.fa-eye-slash:before {\n  content: \"\\F070\";\n}\n.fa-warning:before,\n.fa-exclamation-triangle:before {\n  content: \"\\F071\";\n}\n.fa-plane:before {\n  content: \"\\F072\";\n}\n.fa-calendar:before {\n  content: \"\\F073\";\n}\n.fa-random:before {\n  content: \"\\F074\";\n}\n.fa-comment:before {\n  content: \"\\F075\";\n}\n.fa-magnet:before {\n  content: \"\\F076\";\n}\n.fa-chevron-up:before {\n  content: \"\\F077\";\n}\n.fa-chevron-down:before {\n  content: \"\\F078\";\n}\n.fa-retweet:before {\n  content: \"\\F079\";\n}\n.fa-shopping-cart:before {\n  content: \"\\F07A\";\n}\n.fa-folder:before {\n  content: \"\\F07B\";\n}\n.fa-folder-open:before {\n  content: \"\\F07C\";\n}\n.fa-arrows-v:before {\n  content: \"\\F07D\";\n}\n.fa-arrows-h:before {\n  content: \"\\F07E\";\n}\n.fa-bar-chart-o:before,\n.fa-bar-chart:before {\n  content: \"\\F080\";\n}\n.fa-twitter-square:before {\n  content: \"\\F081\";\n}\n.fa-facebook-square:before {\n  content: \"\\F082\";\n}\n.fa-camera-retro:before {\n  content: \"\\F083\";\n}\n.fa-key:before {\n  content: \"\\F084\";\n}\n.fa-gears:before,\n.fa-cogs:before {\n  content: \"\\F085\";\n}\n.fa-comments:before {\n  content: \"\\F086\";\n}\n.fa-thumbs-o-up:before {\n  content: \"\\F087\";\n}\n.fa-thumbs-o-down:before {\n  content: \"\\F088\";\n}\n.fa-star-half:before {\n  content: \"\\F089\";\n}\n.fa-heart-o:before {\n  content: \"\\F08A\";\n}\n.fa-sign-out:before {\n  content: \"\\F08B\";\n}\n.fa-linkedin-square:before {\n  content: \"\\F08C\";\n}\n.fa-thumb-tack:before {\n  content: \"\\F08D\";\n}\n.fa-external-link:before {\n  content: \"\\F08E\";\n}\n.fa-sign-in:before {\n  content: \"\\F090\";\n}\n.fa-trophy:before {\n  content: \"\\F091\";\n}\n.fa-github-square:before {\n  content: \"\\F092\";\n}\n.fa-upload:before {\n  content: \"\\F093\";\n}\n.fa-lemon-o:before {\n  content: \"\\F094\";\n}\n.fa-phone:before {\n  content: \"\\F095\";\n}\n.fa-square-o:before {\n  content: \"\\F096\";\n}\n.fa-bookmark-o:before {\n  content: \"\\F097\";\n}\n.fa-phone-square:before {\n  content: \"\\F098\";\n}\n.fa-twitter:before {\n  content: \"\\F099\";\n}\n.fa-facebook-f:before,\n.fa-facebook:before {\n  content: \"\\F09A\";\n}\n.fa-github:before {\n  content: \"\\F09B\";\n}\n.fa-unlock:before {\n  content: \"\\F09C\";\n}\n.fa-credit-card:before {\n  content: \"\\F09D\";\n}\n.fa-feed:before,\n.fa-rss:before {\n  content: \"\\F09E\";\n}\n.fa-hdd-o:before {\n  content: \"\\F0A0\";\n}\n.fa-bullhorn:before {\n  content: \"\\F0A1\";\n}\n.fa-bell:before {\n  content: \"\\F0F3\";\n}\n.fa-certificate:before {\n  content: \"\\F0A3\";\n}\n.fa-hand-o-right:before {\n  content: \"\\F0A4\";\n}\n.fa-hand-o-left:before {\n  content: \"\\F0A5\";\n}\n.fa-hand-o-up:before {\n  content: \"\\F0A6\";\n}\n.fa-hand-o-down:before {\n  content: \"\\F0A7\";\n}\n.fa-arrow-circle-left:before {\n  content: \"\\F0A8\";\n}\n.fa-arrow-circle-right:before {\n  content: \"\\F0A9\";\n}\n.fa-arrow-circle-up:before {\n  content: \"\\F0AA\";\n}\n.fa-arrow-circle-down:before {\n  content: \"\\F0AB\";\n}\n.fa-globe:before {\n  content: \"\\F0AC\";\n}\n.fa-wrench:before {\n  content: \"\\F0AD\";\n}\n.fa-tasks:before {\n  content: \"\\F0AE\";\n}\n.fa-filter:before {\n  content: \"\\F0B0\";\n}\n.fa-briefcase:before {\n  content: \"\\F0B1\";\n}\n.fa-arrows-alt:before {\n  content: \"\\F0B2\";\n}\n.fa-group:before,\n.fa-users:before {\n  content: \"\\F0C0\";\n}\n.fa-chain:before,\n.fa-link:before {\n  content: \"\\F0C1\";\n}\n.fa-cloud:before {\n  content: \"\\F0C2\";\n}\n.fa-flask:before {\n  content: \"\\F0C3\";\n}\n.fa-cut:before,\n.fa-scissors:before {\n  content: \"\\F0C4\";\n}\n.fa-copy:before,\n.fa-files-o:before {\n  content: \"\\F0C5\";\n}\n.fa-paperclip:before {\n  content: \"\\F0C6\";\n}\n.fa-save:before,\n.fa-floppy-o:before {\n  content: \"\\F0C7\";\n}\n.fa-square:before {\n  content: \"\\F0C8\";\n}\n.fa-navicon:before,\n.fa-reorder:before,\n.fa-bars:before {\n  content: \"\\F0C9\";\n}\n.fa-list-ul:before {\n  content: \"\\F0CA\";\n}\n.fa-list-ol:before {\n  content: \"\\F0CB\";\n}\n.fa-strikethrough:before {\n  content: \"\\F0CC\";\n}\n.fa-underline:before {\n  content: \"\\F0CD\";\n}\n.fa-table:before {\n  content: \"\\F0CE\";\n}\n.fa-magic:before {\n  content: \"\\F0D0\";\n}\n.fa-truck:before {\n  content: \"\\F0D1\";\n}\n.fa-pinterest:before {\n  content: \"\\F0D2\";\n}\n.fa-pinterest-square:before {\n  content: \"\\F0D3\";\n}\n.fa-google-plus-square:before {\n  content: \"\\F0D4\";\n}\n.fa-google-plus:before {\n  content: \"\\F0D5\";\n}\n.fa-money:before {\n  content: \"\\F0D6\";\n}\n.fa-caret-down:before {\n  content: \"\\F0D7\";\n}\n.fa-caret-up:before {\n  content: \"\\F0D8\";\n}\n.fa-caret-left:before {\n  content: \"\\F0D9\";\n}\n.fa-caret-right:before {\n  content: \"\\F0DA\";\n}\n.fa-columns:before {\n  content: \"\\F0DB\";\n}\n.fa-unsorted:before,\n.fa-sort:before {\n  content: \"\\F0DC\";\n}\n.fa-sort-down:before,\n.fa-sort-desc:before {\n  content: \"\\F0DD\";\n}\n.fa-sort-up:before,\n.fa-sort-asc:before {\n  content: \"\\F0DE\";\n}\n.fa-envelope:before {\n  content: \"\\F0E0\";\n}\n.fa-linkedin:before {\n  content: \"\\F0E1\";\n}\n.fa-rotate-left:before,\n.fa-undo:before {\n  content: \"\\F0E2\";\n}\n.fa-legal:before,\n.fa-gavel:before {\n  content: \"\\F0E3\";\n}\n.fa-dashboard:before,\n.fa-tachometer:before {\n  content: \"\\F0E4\";\n}\n.fa-comment-o:before {\n  content: \"\\F0E5\";\n}\n.fa-comments-o:before {\n  content: \"\\F0E6\";\n}\n.fa-flash:before,\n.fa-bolt:before {\n  content: \"\\F0E7\";\n}\n.fa-sitemap:before {\n  content: \"\\F0E8\";\n}\n.fa-umbrella:before {\n  content: \"\\F0E9\";\n}\n.fa-paste:before,\n.fa-clipboard:before {\n  content: \"\\F0EA\";\n}\n.fa-lightbulb-o:before {\n  content: \"\\F0EB\";\n}\n.fa-exchange:before {\n  content: \"\\F0EC\";\n}\n.fa-cloud-download:before {\n  content: \"\\F0ED\";\n}\n.fa-cloud-upload:before {\n  content: \"\\F0EE\";\n}\n.fa-user-md:before {\n  content: \"\\F0F0\";\n}\n.fa-stethoscope:before {\n  content: \"\\F0F1\";\n}\n.fa-suitcase:before {\n  content: \"\\F0F2\";\n}\n.fa-bell-o:before {\n  content: \"\\F0A2\";\n}\n.fa-coffee:before {\n  content: \"\\F0F4\";\n}\n.fa-cutlery:before {\n  content: \"\\F0F5\";\n}\n.fa-file-text-o:before {\n  content: \"\\F0F6\";\n}\n.fa-building-o:before {\n  content: \"\\F0F7\";\n}\n.fa-hospital-o:before {\n  content: \"\\F0F8\";\n}\n.fa-ambulance:before {\n  content: \"\\F0F9\";\n}\n.fa-medkit:before {\n  content: \"\\F0FA\";\n}\n.fa-fighter-jet:before {\n  content: \"\\F0FB\";\n}\n.fa-beer:before {\n  content: \"\\F0FC\";\n}\n.fa-h-square:before {\n  content: \"\\F0FD\";\n}\n.fa-plus-square:before {\n  content: \"\\F0FE\";\n}\n.fa-angle-double-left:before {\n  content: \"\\F100\";\n}\n.fa-angle-double-right:before {\n  content: \"\\F101\";\n}\n.fa-angle-double-up:before {\n  content: \"\\F102\";\n}\n.fa-angle-double-down:before {\n  content: \"\\F103\";\n}\n.fa-angle-left:before {\n  content: \"\\F104\";\n}\n.fa-angle-right:before {\n  content: \"\\F105\";\n}\n.fa-angle-up:before {\n  content: \"\\F106\";\n}\n.fa-angle-down:before {\n  content: \"\\F107\";\n}\n.fa-desktop:before {\n  content: \"\\F108\";\n}\n.fa-laptop:before {\n  content: \"\\F109\";\n}\n.fa-tablet:before {\n  content: \"\\F10A\";\n}\n.fa-mobile-phone:before,\n.fa-mobile:before {\n  content: \"\\F10B\";\n}\n.fa-circle-o:before {\n  content: \"\\F10C\";\n}\n.fa-quote-left:before {\n  content: \"\\F10D\";\n}\n.fa-quote-right:before {\n  content: \"\\F10E\";\n}\n.fa-spinner:before {\n  content: \"\\F110\";\n}\n.fa-circle:before {\n  content: \"\\F111\";\n}\n.fa-mail-reply:before,\n.fa-reply:before {\n  content: \"\\F112\";\n}\n.fa-github-alt:before {\n  content: \"\\F113\";\n}\n.fa-folder-o:before {\n  content: \"\\F114\";\n}\n.fa-folder-open-o:before {\n  content: \"\\F115\";\n}\n.fa-smile-o:before {\n  content: \"\\F118\";\n}\n.fa-frown-o:before {\n  content: \"\\F119\";\n}\n.fa-meh-o:before {\n  content: \"\\F11A\";\n}\n.fa-gamepad:before {\n  content: \"\\F11B\";\n}\n.fa-keyboard-o:before {\n  content: \"\\F11C\";\n}\n.fa-flag-o:before {\n  content: \"\\F11D\";\n}\n.fa-flag-checkered:before {\n  content: \"\\F11E\";\n}\n.fa-terminal:before {\n  content: \"\\F120\";\n}\n.fa-code:before {\n  content: \"\\F121\";\n}\n.fa-mail-reply-all:before,\n.fa-reply-all:before {\n  content: \"\\F122\";\n}\n.fa-star-half-empty:before,\n.fa-star-half-full:before,\n.fa-star-half-o:before {\n  content: \"\\F123\";\n}\n.fa-location-arrow:before {\n  content: \"\\F124\";\n}\n.fa-crop:before {\n  content: \"\\F125\";\n}\n.fa-code-fork:before {\n  content: \"\\F126\";\n}\n.fa-unlink:before,\n.fa-chain-broken:before {\n  content: \"\\F127\";\n}\n.fa-question:before {\n  content: \"\\F128\";\n}\n.fa-info:before {\n  content: \"\\F129\";\n}\n.fa-exclamation:before {\n  content: \"\\F12A\";\n}\n.fa-superscript:before {\n  content: \"\\F12B\";\n}\n.fa-subscript:before {\n  content: \"\\F12C\";\n}\n.fa-eraser:before {\n  content: \"\\F12D\";\n}\n.fa-puzzle-piece:before {\n  content: \"\\F12E\";\n}\n.fa-microphone:before {\n  content: \"\\F130\";\n}\n.fa-microphone-slash:before {\n  content: \"\\F131\";\n}\n.fa-shield:before {\n  content: \"\\F132\";\n}\n.fa-calendar-o:before {\n  content: \"\\F133\";\n}\n.fa-fire-extinguisher:before {\n  content: \"\\F134\";\n}\n.fa-rocket:before {\n  content: \"\\F135\";\n}\n.fa-maxcdn:before {\n  content: \"\\F136\";\n}\n.fa-chevron-circle-left:before {\n  content: \"\\F137\";\n}\n.fa-chevron-circle-right:before {\n  content: \"\\F138\";\n}\n.fa-chevron-circle-up:before {\n  content: \"\\F139\";\n}\n.fa-chevron-circle-down:before {\n  content: \"\\F13A\";\n}\n.fa-html5:before {\n  content: \"\\F13B\";\n}\n.fa-css3:before {\n  content: \"\\F13C\";\n}\n.fa-anchor:before {\n  content: \"\\F13D\";\n}\n.fa-unlock-alt:before {\n  content: \"\\F13E\";\n}\n.fa-bullseye:before {\n  content: \"\\F140\";\n}\n.fa-ellipsis-h:before {\n  content: \"\\F141\";\n}\n.fa-ellipsis-v:before {\n  content: \"\\F142\";\n}\n.fa-rss-square:before {\n  content: \"\\F143\";\n}\n.fa-play-circle:before {\n  content: \"\\F144\";\n}\n.fa-ticket:before {\n  content: \"\\F145\";\n}\n.fa-minus-square:before {\n  content: \"\\F146\";\n}\n.fa-minus-square-o:before {\n  content: \"\\F147\";\n}\n.fa-level-up:before {\n  content: \"\\F148\";\n}\n.fa-level-down:before {\n  content: \"\\F149\";\n}\n.fa-check-square:before {\n  content: \"\\F14A\";\n}\n.fa-pencil-square:before {\n  content: \"\\F14B\";\n}\n.fa-external-link-square:before {\n  content: \"\\F14C\";\n}\n.fa-share-square:before {\n  content: \"\\F14D\";\n}\n.fa-compass:before {\n  content: \"\\F14E\";\n}\n.fa-toggle-down:before,\n.fa-caret-square-o-down:before {\n  content: \"\\F150\";\n}\n.fa-toggle-up:before,\n.fa-caret-square-o-up:before {\n  content: \"\\F151\";\n}\n.fa-toggle-right:before,\n.fa-caret-square-o-right:before {\n  content: \"\\F152\";\n}\n.fa-euro:before,\n.fa-eur:before {\n  content: \"\\F153\";\n}\n.fa-gbp:before {\n  content: \"\\F154\";\n}\n.fa-dollar:before,\n.fa-usd:before {\n  content: \"\\F155\";\n}\n.fa-rupee:before,\n.fa-inr:before {\n  content: \"\\F156\";\n}\n.fa-cny:before,\n.fa-rmb:before,\n.fa-yen:before,\n.fa-jpy:before {\n  content: \"\\F157\";\n}\n.fa-ruble:before,\n.fa-rouble:before,\n.fa-rub:before {\n  content: \"\\F158\";\n}\n.fa-won:before,\n.fa-krw:before {\n  content: \"\\F159\";\n}\n.fa-bitcoin:before,\n.fa-btc:before {\n  content: \"\\F15A\";\n}\n.fa-file:before {\n  content: \"\\F15B\";\n}\n.fa-file-text:before {\n  content: \"\\F15C\";\n}\n.fa-sort-alpha-asc:before {\n  content: \"\\F15D\";\n}\n.fa-sort-alpha-desc:before {\n  content: \"\\F15E\";\n}\n.fa-sort-amount-asc:before {\n  content: \"\\F160\";\n}\n.fa-sort-amount-desc:before {\n  content: \"\\F161\";\n}\n.fa-sort-numeric-asc:before {\n  content: \"\\F162\";\n}\n.fa-sort-numeric-desc:before {\n  content: \"\\F163\";\n}\n.fa-thumbs-up:before {\n  content: \"\\F164\";\n}\n.fa-thumbs-down:before {\n  content: \"\\F165\";\n}\n.fa-youtube-square:before {\n  content: \"\\F166\";\n}\n.fa-youtube:before {\n  content: \"\\F167\";\n}\n.fa-xing:before {\n  content: \"\\F168\";\n}\n.fa-xing-square:before {\n  content: \"\\F169\";\n}\n.fa-youtube-play:before {\n  content: \"\\F16A\";\n}\n.fa-dropbox:before {\n  content: \"\\F16B\";\n}\n.fa-stack-overflow:before {\n  content: \"\\F16C\";\n}\n.fa-instagram:before {\n  content: \"\\F16D\";\n}\n.fa-flickr:before {\n  content: \"\\F16E\";\n}\n.fa-adn:before {\n  content: \"\\F170\";\n}\n.fa-bitbucket:before {\n  content: \"\\F171\";\n}\n.fa-bitbucket-square:before {\n  content: \"\\F172\";\n}\n.fa-tumblr:before {\n  content: \"\\F173\";\n}\n.fa-tumblr-square:before {\n  content: \"\\F174\";\n}\n.fa-long-arrow-down:before {\n  content: \"\\F175\";\n}\n.fa-long-arrow-up:before {\n  content: \"\\F176\";\n}\n.fa-long-arrow-left:before {\n  content: \"\\F177\";\n}\n.fa-long-arrow-right:before {\n  content: \"\\F178\";\n}\n.fa-apple:before {\n  content: \"\\F179\";\n}\n.fa-windows:before {\n  content: \"\\F17A\";\n}\n.fa-android:before {\n  content: \"\\F17B\";\n}\n.fa-linux:before {\n  content: \"\\F17C\";\n}\n.fa-dribbble:before {\n  content: \"\\F17D\";\n}\n.fa-skype:before {\n  content: \"\\F17E\";\n}\n.fa-foursquare:before {\n  content: \"\\F180\";\n}\n.fa-trello:before {\n  content: \"\\F181\";\n}\n.fa-female:before {\n  content: \"\\F182\";\n}\n.fa-male:before {\n  content: \"\\F183\";\n}\n.fa-gittip:before,\n.fa-gratipay:before {\n  content: \"\\F184\";\n}\n.fa-sun-o:before {\n  content: \"\\F185\";\n}\n.fa-moon-o:before {\n  content: \"\\F186\";\n}\n.fa-archive:before {\n  content: \"\\F187\";\n}\n.fa-bug:before {\n  content: \"\\F188\";\n}\n.fa-vk:before {\n  content: \"\\F189\";\n}\n.fa-weibo:before {\n  content: \"\\F18A\";\n}\n.fa-renren:before {\n  content: \"\\F18B\";\n}\n.fa-pagelines:before {\n  content: \"\\F18C\";\n}\n.fa-stack-exchange:before {\n  content: \"\\F18D\";\n}\n.fa-arrow-circle-o-right:before {\n  content: \"\\F18E\";\n}\n.fa-arrow-circle-o-left:before {\n  content: \"\\F190\";\n}\n.fa-toggle-left:before,\n.fa-caret-square-o-left:before {\n  content: \"\\F191\";\n}\n.fa-dot-circle-o:before {\n  content: \"\\F192\";\n}\n.fa-wheelchair:before {\n  content: \"\\F193\";\n}\n.fa-vimeo-square:before {\n  content: \"\\F194\";\n}\n.fa-turkish-lira:before,\n.fa-try:before {\n  content: \"\\F195\";\n}\n.fa-plus-square-o:before {\n  content: \"\\F196\";\n}\n.fa-space-shuttle:before {\n  content: \"\\F197\";\n}\n.fa-slack:before {\n  content: \"\\F198\";\n}\n.fa-envelope-square:before {\n  content: \"\\F199\";\n}\n.fa-wordpress:before {\n  content: \"\\F19A\";\n}\n.fa-openid:before {\n  content: \"\\F19B\";\n}\n.fa-institution:before,\n.fa-bank:before,\n.fa-university:before {\n  content: \"\\F19C\";\n}\n.fa-mortar-board:before,\n.fa-graduation-cap:before {\n  content: \"\\F19D\";\n}\n.fa-yahoo:before {\n  content: \"\\F19E\";\n}\n.fa-google:before {\n  content: \"\\F1A0\";\n}\n.fa-reddit:before {\n  content: \"\\F1A1\";\n}\n.fa-reddit-square:before {\n  content: \"\\F1A2\";\n}\n.fa-stumbleupon-circle:before {\n  content: \"\\F1A3\";\n}\n.fa-stumbleupon:before {\n  content: \"\\F1A4\";\n}\n.fa-delicious:before {\n  content: \"\\F1A5\";\n}\n.fa-digg:before {\n  content: \"\\F1A6\";\n}\n.fa-pied-piper-pp:before {\n  content: \"\\F1A7\";\n}\n.fa-pied-piper-alt:before {\n  content: \"\\F1A8\";\n}\n.fa-drupal:before {\n  content: \"\\F1A9\";\n}\n.fa-joomla:before {\n  content: \"\\F1AA\";\n}\n.fa-language:before {\n  content: \"\\F1AB\";\n}\n.fa-fax:before {\n  content: \"\\F1AC\";\n}\n.fa-building:before {\n  content: \"\\F1AD\";\n}\n.fa-child:before {\n  content: \"\\F1AE\";\n}\n.fa-paw:before {\n  content: \"\\F1B0\";\n}\n.fa-spoon:before {\n  content: \"\\F1B1\";\n}\n.fa-cube:before {\n  content: \"\\F1B2\";\n}\n.fa-cubes:before {\n  content: \"\\F1B3\";\n}\n.fa-behance:before {\n  content: \"\\F1B4\";\n}\n.fa-behance-square:before {\n  content: \"\\F1B5\";\n}\n.fa-steam:before {\n  content: \"\\F1B6\";\n}\n.fa-steam-square:before {\n  content: \"\\F1B7\";\n}\n.fa-recycle:before {\n  content: \"\\F1B8\";\n}\n.fa-automobile:before,\n.fa-car:before {\n  content: \"\\F1B9\";\n}\n.fa-cab:before,\n.fa-taxi:before {\n  content: \"\\F1BA\";\n}\n.fa-tree:before {\n  content: \"\\F1BB\";\n}\n.fa-spotify:before {\n  content: \"\\F1BC\";\n}\n.fa-deviantart:before {\n  content: \"\\F1BD\";\n}\n.fa-soundcloud:before {\n  content: \"\\F1BE\";\n}\n.fa-database:before {\n  content: \"\\F1C0\";\n}\n.fa-file-pdf-o:before {\n  content: \"\\F1C1\";\n}\n.fa-file-word-o:before {\n  content: \"\\F1C2\";\n}\n.fa-file-excel-o:before {\n  content: \"\\F1C3\";\n}\n.fa-file-powerpoint-o:before {\n  content: \"\\F1C4\";\n}\n.fa-file-photo-o:before,\n.fa-file-picture-o:before,\n.fa-file-image-o:before {\n  content: \"\\F1C5\";\n}\n.fa-file-zip-o:before,\n.fa-file-archive-o:before {\n  content: \"\\F1C6\";\n}\n.fa-file-sound-o:before,\n.fa-file-audio-o:before {\n  content: \"\\F1C7\";\n}\n.fa-file-movie-o:before,\n.fa-file-video-o:before {\n  content: \"\\F1C8\";\n}\n.fa-file-code-o:before {\n  content: \"\\F1C9\";\n}\n.fa-vine:before {\n  content: \"\\F1CA\";\n}\n.fa-codepen:before {\n  content: \"\\F1CB\";\n}\n.fa-jsfiddle:before {\n  content: \"\\F1CC\";\n}\n.fa-life-bouy:before,\n.fa-life-buoy:before,\n.fa-life-saver:before,\n.fa-support:before,\n.fa-life-ring:before {\n  content: \"\\F1CD\";\n}\n.fa-circle-o-notch:before {\n  content: \"\\F1CE\";\n}\n.fa-ra:before,\n.fa-resistance:before,\n.fa-rebel:before {\n  content: \"\\F1D0\";\n}\n.fa-ge:before,\n.fa-empire:before {\n  content: \"\\F1D1\";\n}\n.fa-git-square:before {\n  content: \"\\F1D2\";\n}\n.fa-git:before {\n  content: \"\\F1D3\";\n}\n.fa-y-combinator-square:before,\n.fa-yc-square:before,\n.fa-hacker-news:before {\n  content: \"\\F1D4\";\n}\n.fa-tencent-weibo:before {\n  content: \"\\F1D5\";\n}\n.fa-qq:before {\n  content: \"\\F1D6\";\n}\n.fa-wechat:before,\n.fa-weixin:before {\n  content: \"\\F1D7\";\n}\n.fa-send:before,\n.fa-paper-plane:before {\n  content: \"\\F1D8\";\n}\n.fa-send-o:before,\n.fa-paper-plane-o:before {\n  content: \"\\F1D9\";\n}\n.fa-history:before {\n  content: \"\\F1DA\";\n}\n.fa-circle-thin:before {\n  content: \"\\F1DB\";\n}\n.fa-header:before {\n  content: \"\\F1DC\";\n}\n.fa-paragraph:before {\n  content: \"\\F1DD\";\n}\n.fa-sliders:before {\n  content: \"\\F1DE\";\n}\n.fa-share-alt:before {\n  content: \"\\F1E0\";\n}\n.fa-share-alt-square:before {\n  content: \"\\F1E1\";\n}\n.fa-bomb:before {\n  content: \"\\F1E2\";\n}\n.fa-soccer-ball-o:before,\n.fa-futbol-o:before {\n  content: \"\\F1E3\";\n}\n.fa-tty:before {\n  content: \"\\F1E4\";\n}\n.fa-binoculars:before {\n  content: \"\\F1E5\";\n}\n.fa-plug:before {\n  content: \"\\F1E6\";\n}\n.fa-slideshare:before {\n  content: \"\\F1E7\";\n}\n.fa-twitch:before {\n  content: \"\\F1E8\";\n}\n.fa-yelp:before {\n  content: \"\\F1E9\";\n}\n.fa-newspaper-o:before {\n  content: \"\\F1EA\";\n}\n.fa-wifi:before {\n  content: \"\\F1EB\";\n}\n.fa-calculator:before {\n  content: \"\\F1EC\";\n}\n.fa-paypal:before {\n  content: \"\\F1ED\";\n}\n.fa-google-wallet:before {\n  content: \"\\F1EE\";\n}\n.fa-cc-visa:before {\n  content: \"\\F1F0\";\n}\n.fa-cc-mastercard:before {\n  content: \"\\F1F1\";\n}\n.fa-cc-discover:before {\n  content: \"\\F1F2\";\n}\n.fa-cc-amex:before {\n  content: \"\\F1F3\";\n}\n.fa-cc-paypal:before {\n  content: \"\\F1F4\";\n}\n.fa-cc-stripe:before {\n  content: \"\\F1F5\";\n}\n.fa-bell-slash:before {\n  content: \"\\F1F6\";\n}\n.fa-bell-slash-o:before {\n  content: \"\\F1F7\";\n}\n.fa-trash:before {\n  content: \"\\F1F8\";\n}\n.fa-copyright:before {\n  content: \"\\F1F9\";\n}\n.fa-at:before {\n  content: \"\\F1FA\";\n}\n.fa-eyedropper:before {\n  content: \"\\F1FB\";\n}\n.fa-paint-brush:before {\n  content: \"\\F1FC\";\n}\n.fa-birthday-cake:before {\n  content: \"\\F1FD\";\n}\n.fa-area-chart:before {\n  content: \"\\F1FE\";\n}\n.fa-pie-chart:before {\n  content: \"\\F200\";\n}\n.fa-line-chart:before {\n  content: \"\\F201\";\n}\n.fa-lastfm:before {\n  content: \"\\F202\";\n}\n.fa-lastfm-square:before {\n  content: \"\\F203\";\n}\n.fa-toggle-off:before {\n  content: \"\\F204\";\n}\n.fa-toggle-on:before {\n  content: \"\\F205\";\n}\n.fa-bicycle:before {\n  content: \"\\F206\";\n}\n.fa-bus:before {\n  content: \"\\F207\";\n}\n.fa-ioxhost:before {\n  content: \"\\F208\";\n}\n.fa-angellist:before {\n  content: \"\\F209\";\n}\n.fa-cc:before {\n  content: \"\\F20A\";\n}\n.fa-shekel:before,\n.fa-sheqel:before,\n.fa-ils:before {\n  content: \"\\F20B\";\n}\n.fa-meanpath:before {\n  content: \"\\F20C\";\n}\n.fa-buysellads:before {\n  content: \"\\F20D\";\n}\n.fa-connectdevelop:before {\n  content: \"\\F20E\";\n}\n.fa-dashcube:before {\n  content: \"\\F210\";\n}\n.fa-forumbee:before {\n  content: \"\\F211\";\n}\n.fa-leanpub:before {\n  content: \"\\F212\";\n}\n.fa-sellsy:before {\n  content: \"\\F213\";\n}\n.fa-shirtsinbulk:before {\n  content: \"\\F214\";\n}\n.fa-simplybuilt:before {\n  content: \"\\F215\";\n}\n.fa-skyatlas:before {\n  content: \"\\F216\";\n}\n.fa-cart-plus:before {\n  content: \"\\F217\";\n}\n.fa-cart-arrow-down:before {\n  content: \"\\F218\";\n}\n.fa-diamond:before {\n  content: \"\\F219\";\n}\n.fa-ship:before {\n  content: \"\\F21A\";\n}\n.fa-user-secret:before {\n  content: \"\\F21B\";\n}\n.fa-motorcycle:before {\n  content: \"\\F21C\";\n}\n.fa-street-view:before {\n  content: \"\\F21D\";\n}\n.fa-heartbeat:before {\n  content: \"\\F21E\";\n}\n.fa-venus:before {\n  content: \"\\F221\";\n}\n.fa-mars:before {\n  content: \"\\F222\";\n}\n.fa-mercury:before {\n  content: \"\\F223\";\n}\n.fa-intersex:before,\n.fa-transgender:before {\n  content: \"\\F224\";\n}\n.fa-transgender-alt:before {\n  content: \"\\F225\";\n}\n.fa-venus-double:before {\n  content: \"\\F226\";\n}\n.fa-mars-double:before {\n  content: \"\\F227\";\n}\n.fa-venus-mars:before {\n  content: \"\\F228\";\n}\n.fa-mars-stroke:before {\n  content: \"\\F229\";\n}\n.fa-mars-stroke-v:before {\n  content: \"\\F22A\";\n}\n.fa-mars-stroke-h:before {\n  content: \"\\F22B\";\n}\n.fa-neuter:before {\n  content: \"\\F22C\";\n}\n.fa-genderless:before {\n  content: \"\\F22D\";\n}\n.fa-facebook-official:before {\n  content: \"\\F230\";\n}\n.fa-pinterest-p:before {\n  content: \"\\F231\";\n}\n.fa-whatsapp:before {\n  content: \"\\F232\";\n}\n.fa-server:before {\n  content: \"\\F233\";\n}\n.fa-user-plus:before {\n  content: \"\\F234\";\n}\n.fa-user-times:before {\n  content: \"\\F235\";\n}\n.fa-hotel:before,\n.fa-bed:before {\n  content: \"\\F236\";\n}\n.fa-viacoin:before {\n  content: \"\\F237\";\n}\n.fa-train:before {\n  content: \"\\F238\";\n}\n.fa-subway:before {\n  content: \"\\F239\";\n}\n.fa-medium:before {\n  content: \"\\F23A\";\n}\n.fa-yc:before,\n.fa-y-combinator:before {\n  content: \"\\F23B\";\n}\n.fa-optin-monster:before {\n  content: \"\\F23C\";\n}\n.fa-opencart:before {\n  content: \"\\F23D\";\n}\n.fa-expeditedssl:before {\n  content: \"\\F23E\";\n}\n.fa-battery-4:before,\n.fa-battery-full:before {\n  content: \"\\F240\";\n}\n.fa-battery-3:before,\n.fa-battery-three-quarters:before {\n  content: \"\\F241\";\n}\n.fa-battery-2:before,\n.fa-battery-half:before {\n  content: \"\\F242\";\n}\n.fa-battery-1:before,\n.fa-battery-quarter:before {\n  content: \"\\F243\";\n}\n.fa-battery-0:before,\n.fa-battery-empty:before {\n  content: \"\\F244\";\n}\n.fa-mouse-pointer:before {\n  content: \"\\F245\";\n}\n.fa-i-cursor:before {\n  content: \"\\F246\";\n}\n.fa-object-group:before {\n  content: \"\\F247\";\n}\n.fa-object-ungroup:before {\n  content: \"\\F248\";\n}\n.fa-sticky-note:before {\n  content: \"\\F249\";\n}\n.fa-sticky-note-o:before {\n  content: \"\\F24A\";\n}\n.fa-cc-jcb:before {\n  content: \"\\F24B\";\n}\n.fa-cc-diners-club:before {\n  content: \"\\F24C\";\n}\n.fa-clone:before {\n  content: \"\\F24D\";\n}\n.fa-balance-scale:before {\n  content: \"\\F24E\";\n}\n.fa-hourglass-o:before {\n  content: \"\\F250\";\n}\n.fa-hourglass-1:before,\n.fa-hourglass-start:before {\n  content: \"\\F251\";\n}\n.fa-hourglass-2:before,\n.fa-hourglass-half:before {\n  content: \"\\F252\";\n}\n.fa-hourglass-3:before,\n.fa-hourglass-end:before {\n  content: \"\\F253\";\n}\n.fa-hourglass:before {\n  content: \"\\F254\";\n}\n.fa-hand-grab-o:before,\n.fa-hand-rock-o:before {\n  content: \"\\F255\";\n}\n.fa-hand-stop-o:before,\n.fa-hand-paper-o:before {\n  content: \"\\F256\";\n}\n.fa-hand-scissors-o:before {\n  content: \"\\F257\";\n}\n.fa-hand-lizard-o:before {\n  content: \"\\F258\";\n}\n.fa-hand-spock-o:before {\n  content: \"\\F259\";\n}\n.fa-hand-pointer-o:before {\n  content: \"\\F25A\";\n}\n.fa-hand-peace-o:before {\n  content: \"\\F25B\";\n}\n.fa-trademark:before {\n  content: \"\\F25C\";\n}\n.fa-registered:before {\n  content: \"\\F25D\";\n}\n.fa-creative-commons:before {\n  content: \"\\F25E\";\n}\n.fa-gg:before {\n  content: \"\\F260\";\n}\n.fa-gg-circle:before {\n  content: \"\\F261\";\n}\n.fa-tripadvisor:before {\n  content: \"\\F262\";\n}\n.fa-odnoklassniki:before {\n  content: \"\\F263\";\n}\n.fa-odnoklassniki-square:before {\n  content: \"\\F264\";\n}\n.fa-get-pocket:before {\n  content: \"\\F265\";\n}\n.fa-wikipedia-w:before {\n  content: \"\\F266\";\n}\n.fa-safari:before {\n  content: \"\\F267\";\n}\n.fa-chrome:before {\n  content: \"\\F268\";\n}\n.fa-firefox:before {\n  content: \"\\F269\";\n}\n.fa-opera:before {\n  content: \"\\F26A\";\n}\n.fa-internet-explorer:before {\n  content: \"\\F26B\";\n}\n.fa-tv:before,\n.fa-television:before {\n  content: \"\\F26C\";\n}\n.fa-contao:before {\n  content: \"\\F26D\";\n}\n.fa-500px:before {\n  content: \"\\F26E\";\n}\n.fa-amazon:before {\n  content: \"\\F270\";\n}\n.fa-calendar-plus-o:before {\n  content: \"\\F271\";\n}\n.fa-calendar-minus-o:before {\n  content: \"\\F272\";\n}\n.fa-calendar-times-o:before {\n  content: \"\\F273\";\n}\n.fa-calendar-check-o:before {\n  content: \"\\F274\";\n}\n.fa-industry:before {\n  content: \"\\F275\";\n}\n.fa-map-pin:before {\n  content: \"\\F276\";\n}\n.fa-map-signs:before {\n  content: \"\\F277\";\n}\n.fa-map-o:before {\n  content: \"\\F278\";\n}\n.fa-map:before {\n  content: \"\\F279\";\n}\n.fa-commenting:before {\n  content: \"\\F27A\";\n}\n.fa-commenting-o:before {\n  content: \"\\F27B\";\n}\n.fa-houzz:before {\n  content: \"\\F27C\";\n}\n.fa-vimeo:before {\n  content: \"\\F27D\";\n}\n.fa-black-tie:before {\n  content: \"\\F27E\";\n}\n.fa-fonticons:before {\n  content: \"\\F280\";\n}\n.fa-reddit-alien:before {\n  content: \"\\F281\";\n}\n.fa-edge:before {\n  content: \"\\F282\";\n}\n.fa-credit-card-alt:before {\n  content: \"\\F283\";\n}\n.fa-codiepie:before {\n  content: \"\\F284\";\n}\n.fa-modx:before {\n  content: \"\\F285\";\n}\n.fa-fort-awesome:before {\n  content: \"\\F286\";\n}\n.fa-usb:before {\n  content: \"\\F287\";\n}\n.fa-product-hunt:before {\n  content: \"\\F288\";\n}\n.fa-mixcloud:before {\n  content: \"\\F289\";\n}\n.fa-scribd:before {\n  content: \"\\F28A\";\n}\n.fa-pause-circle:before {\n  content: \"\\F28B\";\n}\n.fa-pause-circle-o:before {\n  content: \"\\F28C\";\n}\n.fa-stop-circle:before {\n  content: \"\\F28D\";\n}\n.fa-stop-circle-o:before {\n  content: \"\\F28E\";\n}\n.fa-shopping-bag:before {\n  content: \"\\F290\";\n}\n.fa-shopping-basket:before {\n  content: \"\\F291\";\n}\n.fa-hashtag:before {\n  content: \"\\F292\";\n}\n.fa-bluetooth:before {\n  content: \"\\F293\";\n}\n.fa-bluetooth-b:before {\n  content: \"\\F294\";\n}\n.fa-percent:before {\n  content: \"\\F295\";\n}\n.fa-gitlab:before {\n  content: \"\\F296\";\n}\n.fa-wpbeginner:before {\n  content: \"\\F297\";\n}\n.fa-wpforms:before {\n  content: \"\\F298\";\n}\n.fa-envira:before {\n  content: \"\\F299\";\n}\n.fa-universal-access:before {\n  content: \"\\F29A\";\n}\n.fa-wheelchair-alt:before {\n  content: \"\\F29B\";\n}\n.fa-question-circle-o:before {\n  content: \"\\F29C\";\n}\n.fa-blind:before {\n  content: \"\\F29D\";\n}\n.fa-audio-description:before {\n  content: \"\\F29E\";\n}\n.fa-volume-control-phone:before {\n  content: \"\\F2A0\";\n}\n.fa-braille:before {\n  content: \"\\F2A1\";\n}\n.fa-assistive-listening-systems:before {\n  content: \"\\F2A2\";\n}\n.fa-asl-interpreting:before,\n.fa-american-sign-language-interpreting:before {\n  content: \"\\F2A3\";\n}\n.fa-deafness:before,\n.fa-hard-of-hearing:before,\n.fa-deaf:before {\n  content: \"\\F2A4\";\n}\n.fa-glide:before {\n  content: \"\\F2A5\";\n}\n.fa-glide-g:before {\n  content: \"\\F2A6\";\n}\n.fa-signing:before,\n.fa-sign-language:before {\n  content: \"\\F2A7\";\n}\n.fa-low-vision:before {\n  content: \"\\F2A8\";\n}\n.fa-viadeo:before {\n  content: \"\\F2A9\";\n}\n.fa-viadeo-square:before {\n  content: \"\\F2AA\";\n}\n.fa-snapchat:before {\n  content: \"\\F2AB\";\n}\n.fa-snapchat-ghost:before {\n  content: \"\\F2AC\";\n}\n.fa-snapchat-square:before {\n  content: \"\\F2AD\";\n}\n.fa-pied-piper:before {\n  content: \"\\F2AE\";\n}\n.fa-first-order:before {\n  content: \"\\F2B0\";\n}\n.fa-yoast:before {\n  content: \"\\F2B1\";\n}\n.fa-themeisle:before {\n  content: \"\\F2B2\";\n}\n.fa-google-plus-circle:before,\n.fa-google-plus-official:before {\n  content: \"\\F2B3\";\n}\n.fa-fa:before,\n.fa-font-awesome:before {\n  content: \"\\F2B4\";\n}\n/* makes the font 33% larger relative to the icon container */\n.fa-lg {\n  font-size: 1.33333333em;\n  line-height: 0.75em;\n  vertical-align: -15%;\n}\n.fa-2x {\n  font-size: 2em;\n}\n.fa-3x {\n  font-size: 3em;\n}\n.fa-4x {\n  font-size: 4em;\n}\n.fa-5x {\n  font-size: 5em;\n}\n.fa-ul {\n  padding-left: 0;\n  margin-left: 2.14285714em;\n  list-style-type: none;\n}\n.fa-ul > li {\n  position: relative;\n}\n.fa-li {\n  position: absolute;\n  left: -2.14285714em;\n  width: 2.14285714em;\n  top: 0.14285714em;\n  text-align: center;\n}\n.fa-li.fa-lg {\n  left: -1.85714286em;\n}\n/* FONT PATH\n * -------------------------- */\n@font-face {\n  font-family: 'FontAwesome';\n  src: url(" + __webpack_require__(31) + ");\n  src: url(" + __webpack_require__(32) + "?#iefix&v=4.6.3) format('embedded-opentype'), url(" + __webpack_require__(33) + ") format('woff2'), url(" + __webpack_require__(34) + ") format('woff'), url(" + __webpack_require__(35) + ") format('truetype'), url(" + __webpack_require__(36) + "#fontawesomeregular) format('svg');\n  font-weight: normal;\n  font-style: normal;\n}\n.fa-rotate-90 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)\";\n  -webkit-transform: rotate(90deg);\n  -ms-transform: rotate(90deg);\n  transform: rotate(90deg);\n}\n.fa-rotate-180 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)\";\n  -webkit-transform: rotate(180deg);\n  -ms-transform: rotate(180deg);\n  transform: rotate(180deg);\n}\n.fa-rotate-270 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)\";\n  -webkit-transform: rotate(270deg);\n  -ms-transform: rotate(270deg);\n  transform: rotate(270deg);\n}\n.fa-flip-horizontal {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)\";\n  -webkit-transform: scale(-1, 1);\n  -ms-transform: scale(-1, 1);\n  transform: scale(-1, 1);\n}\n.fa-flip-vertical {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";\n  -webkit-transform: scale(1, -1);\n  -ms-transform: scale(1, -1);\n  transform: scale(1, -1);\n}\n:root .fa-rotate-90,\n:root .fa-rotate-180,\n:root .fa-rotate-270,\n:root .fa-flip-horizontal,\n:root .fa-flip-vertical {\n  filter: none;\n}\n.fa-spin {\n  -webkit-animation: fa-spin 2s infinite linear;\n  animation: fa-spin 2s infinite linear;\n}\n.fa-pulse {\n  -webkit-animation: fa-spin 1s infinite steps(8);\n  animation: fa-spin 1s infinite steps(8);\n}\n@-webkit-keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(359deg);\n    transform: rotate(359deg);\n  }\n}\n@keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(359deg);\n    transform: rotate(359deg);\n  }\n}\n.fa-stack {\n  position: relative;\n  display: inline-block;\n  width: 2em;\n  height: 2em;\n  line-height: 2em;\n  vertical-align: middle;\n}\n.fa-stack-1x,\n.fa-stack-2x {\n  position: absolute;\n  left: 0;\n  width: 100%;\n  text-align: center;\n}\n.fa-stack-1x {\n  line-height: inherit;\n}\n.fa-stack-2x {\n  font-size: 2em;\n}\n.fa-inverse {\n  color: #fff;\n}\n", ""]);
	
	// exports


/***/ },

/***/ 30:
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },

/***/ 31:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "25a32416abee198dd821b0b17a198a8f.eot";

/***/ },

/***/ 32:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "25a32416abee198dd821b0b17a198a8f.eot";

/***/ },

/***/ 33:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "e6cf7c6ec7c2d6f670ae9d762604cb0b.woff2";

/***/ },

/***/ 34:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "c8ddf1e5e5bf3682bc7bebf30f394148.woff";

/***/ },

/***/ 35:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "1dc35d25e61d819a9c357074014867ab.ttf";

/***/ },

/***/ 36:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "d7c639084f684d66a1bc66855d193ed8.svg";

/***/ },

/***/ 37:
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;
	
	module.exports = function(list, options) {
		if(true) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}
	
	function createLinkElement() {
		var linkElement = document.createElement("link");
		var head = getHeadElement();
		linkElement.rel = "stylesheet";
		head.appendChild(linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement();
			update = updateLink.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },

/***/ 38:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 53:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($, d3, _, jQuery) {'use strict';
	
	var root = undefined;
	
	var datamonkey = function datamonkey() {};
	
	if (true) {
	  if (typeof module !== 'undefined' && module.exports) {
	    exports = module.exports = datamonkey;
	  }
	  exports.datamonkey = datamonkey;
	} else {
	  root.datamonkey = datamonkey;
	}
	
	datamonkey.errorModal = function (msg) {
	  $('#modal-error-msg').text(msg);
	  $('#errorModal').modal();
	};
	
	datamonkey.export_csv_button = function (data) {
	  data = d3.csv.format(data);
	  if (data !== null) {
	    var pom = document.createElement('a');
	    pom.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(data));
	    pom.setAttribute('download', 'export.csv');
	    pom.className = 'btn btn-default btn-sm';
	    pom.innerHTML = '<span class="glyphicon glyphicon-floppy-save"></span> Download CSV';
	    $("body").append(pom);
	    pom.click();
	    pom.remove();
	  }
	};
	
	datamonkey.save_image = function (type, container) {
	
	  var prefix = {
	    xmlns: "http://www.w3.org/2000/xmlns/",
	    xlink: "http://www.w3.org/1999/xlink",
	    svg: "http://www.w3.org/2000/svg"
	  };
	
	  function get_styles(doc) {
	
	    function process_stylesheet(ss) {
	      try {
	        if (ss.cssRules) {
	          for (var i = 0; i < ss.cssRules.length; i++) {
	            var rule = ss.cssRules[i];
	            if (rule.type === 3) {
	              // Import Rule
	              process_stylesheet(rule.styleSheet);
	            } else {
	              // hack for illustrator crashing on descendent selectors
	              if (rule.selectorText) {
	                if (rule.selectorText.indexOf(">") === -1) {
	                  styles += "\n" + rule.cssText;
	                }
	              }
	            }
	          }
	        }
	      } catch (e) {
	        console.log('Could not process stylesheet : ' + ss);
	      }
	    }
	
	    var styles = "",
	        styleSheets = doc.styleSheets;
	
	    if (styleSheets) {
	      for (var i = 0; i < styleSheets.length; i++) {
	        process_stylesheet(styleSheets[i]);
	      }
	    }
	
	    return styles;
	  }
	
	  var convert_svg_to_png = function convert_svg_to_png(image_string) {
	
	    var image = document.getElementById("hyphy-chart-image");
	
	    image.onload = function () {
	
	      var canvas = document.getElementById("hyphy-chart-canvas");
	      canvas.width = image.width;
	      canvas.height = image.height;
	      var context = canvas.getContext("2d");
	      context.fillStyle = "#FFFFFF";
	      context.fillRect(0, 0, image.width, image.height);
	      context.drawImage(image, 0, 0);
	      var img = canvas.toDataURL("image/png");
	      var pom = document.createElement('a');
	      pom.setAttribute('download', 'image.png');
	      pom.href = canvas.toDataURL("image/png");
	      $("body").append(pom);
	      pom.click();
	      pom.remove();
	    };
	
	    image.src = image_string;
	  };
	
	  var svg = $(container).find("svg")[0];
	  if (!svg) {
	    svg = $(container)[0];
	  }
	
	  var styles = get_styles(window.document);
	
	  svg.setAttribute("version", "1.1");
	
	  var defsEl = document.createElement("defs");
	  svg.insertBefore(defsEl, svg.firstChild);
	
	  var styleEl = document.createElement("style");
	  defsEl.appendChild(styleEl);
	  styleEl.setAttribute("type", "text/css");
	
	  // removing attributes so they aren't doubled up
	  svg.removeAttribute("xmlns");
	  svg.removeAttribute("xlink");
	
	  // These are needed for the svg
	  if (!svg.hasAttributeNS(prefix.xmlns, "xmlns")) {
	    svg.setAttributeNS(prefix.xmlns, "xmlns", prefix.svg);
	  }
	
	  if (!svg.hasAttributeNS(prefix.xmlns, "xmlns:xlink")) {
	    svg.setAttributeNS(prefix.xmlns, "xmlns:xlink", prefix.xlink);
	  }
	
	  var source = new XMLSerializer().serializeToString(svg).replace('</style>', '<![CDATA[' + styles + ']]></style>');
	  var rect = svg.getBoundingClientRect();
	  var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
	  var to_download = [doctype + source];
	  var image_string = 'data:image/svg+xml;base66,' + encodeURIComponent(to_download);
	
	  if (type == "png") {
	    convert_svg_to_png(image_string);
	  } else {
	    var pom = document.createElement('a');
	    pom.setAttribute('download', 'image.svg');
	    pom.setAttribute('href', image_string);
	    $("body").append(pom);
	    pom.click();
	    pom.remove();
	  }
	};
	
	datamonkey.jobQueue = function (container) {
	
	  // Load template
	  _.templateSettings = {
	    evaluate: /\{\%(.+?)\%\}/g,
	    interpolate: /\{\{(.+?)\}\}/g,
	    variable: "rc"
	  };
	
	  d3.json('/jobqueue', function (data) {
	
	    var job_queue = _.template($("script.job-queue").html());
	
	    var job_queue_html = job_queue(data);
	    $("#job-queue-panel").find('table').remove();
	    $(container).append(job_queue_html);
	  });
	};
	
	datamonkey.status_check = function () {
	
	  // Check if there are any status checkers on the page
	  if ($(".status-checker").length) {
	    // Check health status and report back to element
	    var url = "/clusterhealth";
	    d3.json(url, function (data) {
	      // Add appropriate class based on result
	      if (data.successful_connection) {
	        d3.select('.status-checker').classed({ 'status-healthy': true, 'status-troubled': false });
	        $(".status-checker").attr("title", 'Cluster Status : Healthy');
	      } else {
	        d3.select('.status-checker').classed({ 'status-healthy': false, 'status-troubled': true });
	        $(".status-checker").attr("title", 'Cluster Status : Troubled; ' + data.msg.description);
	      }
	    });
	  }
	};
	
	datamonkey.validate_date = function () {
	
	  // Check that it is not empty
	  if ($(this).val().length === 0) {
	    $(this).next('.help-block').remove();
	    $(this).parent().removeClass('has-success');
	    $(this).parent().addClass('has-error');
	
	    jQuery('<span/>', {
	      class: 'help-block',
	      text: 'Field is empty'
	    }).insertAfter($(this));
	  } else if (isNaN(Date.parse($(this).val()))) {
	    $(this).next('.help-block').remove();
	    $(this).parent().removeClass('has-success');
	    $(this).parent().addClass('has-error');
	
	    jQuery('<span/>', {
	      class: 'help-block',
	      text: 'Date format should be in the format YYYY-mm-dd'
	    }).insertAfter($(this));
	  } else {
	    $(this).parent().removeClass('has-error');
	    $(this).parent().addClass('has-success');
	    $(this).next('.help-block').remove();
	  }
	};
	
	$(document).ready(function () {
	  $(function () {
	    $('[data-toggle="tooltip"]').tooltip();
	  });
	  $('#datamonkey-header').collapse();
	
	  var initial_padding = $("body").css("padding-top");
	
	  $("#collapse_nav_bar").on("click", function (e) {
	    $('#datamonkey-header').collapse('toggle');
	    $(this).find("i").toggleClass("fa-times-circle fa-eye");
	    var new_padding = $("body").css("padding-top") == initial_padding ? "5px" : initial_padding;
	    d3.select("body").transition().style("padding-top", new_padding);
	  });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15), __webpack_require__(54), __webpack_require__(57), __webpack_require__(15)))

/***/ },

/***/ 59:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3, $, _) {"use strict";
	
	__webpack_require__(60);
	__webpack_require__(218);
	__webpack_require__(219);
	__webpack_require__(220);
	__webpack_require__(221);
	
	var React = __webpack_require__(61);
	
	var BSREL = React.createClass({
	  displayName: "BSREL",
	
	
	  float_format: d3.format(".2f"),
	
	  loadFromServer: function loadFromServer() {
	
	    var self = this;
	    d3.json(this.props.url, function (data) {
	
	      data["fits"]["MG94"]["branch-annotations"] = self.formatBranchAnnotations(data, "MG94");
	      data["fits"]["Full model"]["branch-annotations"] = self.formatBranchAnnotations(data, "Full model");
	
	      // GH-#18 Add omega annotation tag
	      data["fits"]["MG94"]["annotation-tag"] = "ω";
	      data["fits"]["Full model"]["annotation-tag"] = "ω";
	
	      var annotations = data["fits"]["Full model"]["branch-annotations"],
	          json = data,
	          pmid = data["PMID"],
	          test_results = data["test results"];
	
	      self.setState({
	        annotations: annotations,
	        json: json,
	        pmid: pmid,
	        test_results: test_results
	      });
	    });
	  },
	
	  getDefaultProps: function getDefaultProps() {
	
	    var edgeColorizer = function edgeColorizer(element, data) {
	
	      var self = this;
	
	      var svg = d3.select("#tree_container svg"),
	          svg_defs = d3.select(".phylotree-definitions");
	
	      if (svg_defs.empty()) {
	        svg_defs = svg.append("defs").attr("class", "phylotree-definitions");
	      }
	
	      // clear existing linearGradients
	
	      var scaling_exponent = 1.0 / 3,
	          omega_format = d3.format(".3r"),
	          prop_format = d3.format(".2p"),
	          fit_format = d3.format(".2f"),
	          p_value_format = d3.format(".4f");
	
	      self.omega_color = d3.scale.pow().exponent(scaling_exponent).domain([0, 0.25, 1, 5, 10]).range(self.options()["color-fill"] ? ["#DDDDDD", "#AAAAAA", "#888888", "#444444", "#000000"] : ["#6e4fa2", "#3288bd", "#e6f598", "#f46d43", "#9e0142"]).clamp(true);
	
	      var createBranchGradient = function createBranchGradient(node) {
	
	        function generateGradient(svg_defs, grad_id, annotations, already_cumulative) {
	
	          var current_weight = 0;
	          var this_grad = svg_defs.append("linearGradient").attr("id", grad_id);
	
	          annotations.forEach(function (d, i) {
	
	            if (d.prop) {
	              var new_weight = current_weight + d.prop;
	              this_grad.append("stop").attr("offset", "" + current_weight * 100 + "%").style("stop-color", self.omega_color(d.omega));
	              this_grad.append("stop").attr("offset", "" + new_weight * 100 + "%").style("stop-color", self.omega_color(d.omega));
	              current_weight = new_weight;
	            }
	          });
	        }
	
	        // Create svg definitions
	        if (self.gradient_count == undefined) {
	          self.gradient_count = 0;
	        }
	
	        if (node.annotations) {
	
	          if (node.annotations.length == 1) {
	            node['color'] = self.omega_color(node.annotations[0]["omega"]);
	          } else {
	            self.gradient_count++;
	            var grad_id = "branch_gradient_" + self.gradient_count;
	            generateGradient(svg_defs, grad_id, node.annotations.omegas);
	            node['grad'] = grad_id;
	          }
	        }
	      };
	
	      var annotations = data.target.annotations,
	          alpha_level = 0.05,
	          tooltip = "<b>" + data.target.name + "</b>",
	          reference_omega_weight = prop_format(0),
	          distro = '';
	
	      if (annotations) {
	
	        reference_omega_weight = annotations.omegas[0].prop;
	
	        annotations.omegas.forEach(function (d, i) {
	
	          var omega_value = d.omega > 1e20 ? "&infin;" : omega_format(d.omega),
	              omega_weight = prop_format(d.prop);
	
	          tooltip += "<br/>&omega;<sub>" + (i + 1) + "</sub> = " + omega_value + " (" + omega_weight + ")";
	
	          if (i) {
	            distro += "<br/>";
	          }
	
	          distro += "&omega;<sub>" + (i + 1) + "</sub> = " + omega_value + " (" + omega_weight + ")";
	        });
	
	        tooltip += "<br/><i>p = " + omega_format(annotations["p"]) + "</i>";
	
	        $(element[0][0]).tooltip({
	          'title': tooltip,
	          'html': true,
	          'trigger': 'hover',
	          'container': 'body',
	          'placement': 'auto'
	        });
	
	        createBranchGradient(data.target);
	
	        if (data.target.grad) {
	          element.style('stroke', 'url(#' + data.target.grad + ')');
	        } else {
	          element.style('stroke', data.target.color);
	        }
	
	        element.style('stroke-width', annotations["p"] <= alpha_level ? '12' : '5').style('stroke-linejoin', 'round').style('stroke-linecap', 'round');
	      }
	    };
	
	    return {
	      edgeColorizer: edgeColorizer
	    };
	  },
	
	  getInitialState: function getInitialState() {
	
	    var tree_settings = {
	      'omegaPlot': {},
	      'tree-options': {
	        /* value arrays have the following meaning
	            [0] - the value of the attribute
	            [1] - does the change in attribute value trigger tree re-layout?
	        */
	        'hyphy-tree-model': ['Full model', true],
	        'hyphy-tree-highlight': [null, false],
	        'hyphy-tree-branch-lengths': [true, true],
	        'hyphy-tree-hide-legend': [false, true],
	        'hyphy-tree-fill-color': [false, true]
	      },
	      'suppress-tree-render': false,
	      'chart-append-html': true,
	      'edgeColorizer': this.props.edgeColorizer
	    };
	
	    return {
	      annotations: null,
	      json: null,
	      pmid: null,
	      settings: tree_settings,
	      test_results: null,
	      tree: null
	    };
	  },
	
	  componentWillMount: function componentWillMount() {
	    this.loadFromServer();
	    this.setEvents();
	  },
	
	  setEvents: function setEvents() {
	
	    var self = this;
	
	    $("#datamonkey-absrel-json-file").on("change", function (e) {
	      var files = e.target.files; // FileList object
	
	      if (files.length == 1) {
	        var f = files[0];
	        var reader = new FileReader();
	
	        reader.onload = function (theFile) {
	          return function (e) {
	            var data = JSON.parse(this.result);
	            data["fits"]["MG94"]["branch-annotations"] = self.formatBranchAnnotations(data, "MG94");
	            data["fits"]["Full model"]["branch-annotations"] = self.formatBranchAnnotations(data, "Full model");
	
	            var annotations = data["fits"]["Full model"]["branch-annotations"],
	                json = data,
	                pmid = data["PMID"],
	                test_results = data["test results"];
	
	            self.setState({
	              annotations: annotations,
	              json: json,
	              pmid: pmid,
	              test_results: test_results
	            });
	          };
	        }(f);
	        reader.readAsText(f);
	      }
	
	      $("#datamonkey-absrel-toggle-here").dropdown("toggle");
	      e.preventDefault();
	    });
	  },
	
	  formatBranchAnnotations: function formatBranchAnnotations(json, key) {
	
	    var initial_branch_annotations = json["fits"][key]["branch-annotations"];
	
	    if (!initial_branch_annotations) {
	      initial_branch_annotations = json["fits"][key]["rate distributions"];
	    }
	
	    // Iterate over objects
	    branch_annotations = _.mapObject(initial_branch_annotations, function (val, key) {
	
	      var vals = [];
	      try {
	        vals = JSON.parse(val);
	      } catch (e) {
	        vals = val;
	      }
	
	      var omegas = { "omegas": _.map(vals, function (d) {
	          return _.object(["omega", "prop"], d);
	        }) };
	      var test_results = _.clone(json["test results"][key]);
	      _.extend(test_results, omegas);
	      return test_results;
	    });
	
	    return branch_annotations;
	  },
	
	  initialize: function initialize() {
	
	    var model_fits_id = "#hyphy-model-fits",
	        omega_plots_id = "#hyphy-omega-plots",
	        summary_id = "#hyphy-relax-summary",
	        tree_id = "#tree-tab";
	  },
	
	  render: function render() {
	
	    var self = this;
	
	    return React.createElement(
	      "div",
	      { className: "tab-content" },
	      React.createElement(
	        "div",
	        { className: "tab-pane active", id: "summary-tab" },
	        React.createElement(
	          "div",
	          { className: "row" },
	          React.createElement(
	            "div",
	            { id: "summary-div", className: "col-md-12" },
	            React.createElement(BSRELSummary, { test_results: self.state.test_results,
	              pmid: self.state.pmid })
	          )
	        ),
	        React.createElement(
	          "div",
	          { className: "row" },
	          React.createElement(
	            "div",
	            { id: "hyphy-tree-summary", className: "col-md-6" },
	            React.createElement(TreeSummary, { json: self.state.json })
	          ),
	          React.createElement(
	            "div",
	            { id: "hyphy-model-fits", className: "col-md-6" },
	            React.createElement(ModelFits, { json: self.state.json })
	          )
	        )
	      ),
	      React.createElement(
	        "div",
	        { className: "tab-pane", id: "tree-tab" },
	        React.createElement(Tree, { json: self.state.json,
	          settings: self.state.settings })
	      ),
	      React.createElement(
	        "div",
	        { className: "tab-pane", id: "table_tab" },
	        React.createElement(BranchTable, { tree: self.state.tree,
	          test_results: self.state.test_results,
	          annotations: self.state.annotations })
	      )
	    );
	  }
	
	});
	
	// Will need to make a call to this
	// omega distributions
	function render_absrel(url, element) {
	  React.render(React.createElement(BSREL, { url: url }), document.getElementById(element));
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(54), __webpack_require__(15), __webpack_require__(57)))

/***/ },

/***/ 60:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3, _) {'use strict';
	
	var React = __webpack_require__(61);
	
	var BSRELSummary = React.createClass({
	  displayName: 'BSRELSummary',
	
	
	  float_format: d3.format(".2f"),
	
	  countBranchesTested: function countBranchesTested(branches_tested) {
	
	    if (branches_tested) {
	      return branches_tested.split(';').length;
	    } else {
	      return 0;
	    }
	  },
	
	  getBranchesWithEvidence: function getBranchesWithEvidence(test_results) {
	
	    var self = this;
	    return _.filter(test_results, function (d) {
	      return d.p <= .05;
	    }).length;
	  },
	
	  getTestBranches: function getTestBranches(test_results) {
	
	    var self = this;
	    return _.filter(test_results, function (d) {
	      return d.tested > 0;
	    }).length;
	  },
	
	  getTotalBranches: function getTotalBranches(test_results) {
	
	    var self = this;
	    return _.keys(test_results).length;
	  },
	
	  getInitialState: function getInitialState() {
	
	    var self = this;
	
	    return {
	      branches_with_evidence: this.getBranchesWithEvidence(self.props.test_results),
	      test_branches: this.getTestBranches(self.props.test_results),
	      total_branches: this.getTotalBranches(self.props.test_results)
	    };
	  },
	
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	
	    this.setState({
	      branches_with_evidence: this.getBranchesWithEvidence(nextProps.test_results),
	      test_branches: this.getTestBranches(nextProps.test_results),
	      total_branches: this.getTotalBranches(nextProps.test_results)
	    });
	  },
	
	  render: function render() {
	
	    var self = this;
	
	    return React.createElement(
	      'ul',
	      { className: 'list-group' },
	      React.createElement(
	        'li',
	        { className: 'list-group-item list-group-item-info' },
	        React.createElement(
	          'h3',
	          { className: 'list-group-item-heading' },
	          React.createElement('i', { className: 'fa fa-list' }),
	          React.createElement(
	            'span',
	            { id: 'summary-method-name' },
	            'Adaptive branch site REL'
	          ),
	          ' summary'
	        ),
	        React.createElement(
	          'p',
	          { className: 'list-group-item-text lead' },
	          'Evidence',
	          React.createElement(
	            'sup',
	            null,
	            '\u2020'
	          ),
	          ' of episodic diversifying selection was found on',
	          React.createElement(
	            'strong',
	            null,
	            ' ',
	            self.state.branches_with_evidence
	          ),
	          ' out of',
	          React.createElement(
	            'span',
	            null,
	            ' ',
	            self.state.test_branches
	          ),
	          ' tested branches (',
	          React.createElement(
	            'span',
	            null,
	            self.state.total_branches
	          ),
	          ' total branches).'
	        ),
	        React.createElement(
	          'p',
	          null,
	          React.createElement(
	            'small',
	            null,
	            React.createElement(
	              'sup',
	              null,
	              '\u2020'
	            ),
	            React.createElement(
	              'abbr',
	              { title: 'Likelihood Ratio Test' },
	              'LRT'
	            ),
	            ' p \u2264 0.05, corrected for multiple testing.'
	          )
	        ),
	        React.createElement(
	          'p',
	          null,
	          React.createElement(
	            'small',
	            null,
	            'Please cite ',
	            React.createElement(
	              'a',
	              { href: 'http://www.ncbi.nlm.nih.gov/pubmed/25697341', id: 'summary-pmid', target: '_blank' },
	              'PMID 25697341'
	            ),
	            ' if you use this result in a publication, presentation, or other scientific work.'
	          )
	        )
	      )
	    );
	  }
	
	});
	
	// Will need to make a call to this
	// omega distributions
	function render_absrel_summary(test_results, pmid, element) {
	  React.render(React.createElement(BSRELSummary, { test_results: test_results, pmid: pmid }), document.getElementById(element));
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(54), __webpack_require__(57)))

/***/ },

/***/ 218:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3, _, $) {"use strict";
	
	var React = __webpack_require__(61);
	
	var ModelFits = React.createClass({
	  displayName: "ModelFits",
	
	
	  getInitialState: function getInitialState() {
	    var table_row_data = this.getModelRows(this.props.json),
	        table_columns = this.getModelColumns(table_row_data);
	
	    return {
	      table_row_data: table_row_data,
	      table_columns: table_columns
	    };
	  },
	
	  formatRuntime: function formatRuntime(seconds) {
	    var duration_string = "",
	        seconds = parseFloat(seconds);
	
	    var split_array = [Math.floor(seconds / (24 * 3600)), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60],
	        quals = ["d.", "hrs.", "min.", "sec."];
	
	    split_array.forEach(function (d, i) {
	      if (d) {
	        duration_string += " " + d + " " + quals[i];
	      }
	    });
	
	    return duration_string;
	  },
	
	  getLogLikelihood: function getLogLikelihood(this_model) {
	    return d3.format(".2f")(this_model['log-likelihood']);
	  },
	
	  getAIC: function getAIC(this_model) {
	    return d3.format(".2f")(this_model['AIC-c']);
	  },
	
	  getNumParameters: function getNumParameters(this_model) {
	    return this_model['parameters'];
	  },
	
	  getBranchLengths: function getBranchLengths(this_model) {
	
	    if (this_model["tree length"]) {
	      return d3.format(".2f")(this_model["tree length"]);
	    } else {
	      return d3.format(".2f")(d3.values(this_model["branch-lengths"]).reduce(function (p, c) {
	        return p + c;
	      }, 0));
	    }
	  },
	
	  getRuntime: function getRuntime(this_model) {
	    //return this.formatRuntime(this_model['runtime']);
	    return this.formatRuntime(this_model['runtime']);
	  },
	
	  getDistributions: function getDistributions(m, this_model) {
	
	    var omega_distributions = {};
	    omega_distributions[m] = {};
	
	    var omega_format = d3.format(".3r"),
	        prop_format = d3.format(".2p");
	    p_value_format = d3.format(".4f");
	
	    var distributions = [];
	
	    for (var d in this_model["rate-distributions"]) {
	
	      var this_distro = this_model["rate-distributions"][d];
	      var this_distro_entry = [d, "", "", ""];
	
	      omega_distributions[m][d] = this_distro.map(function (d) {
	        return {
	          'omega': d[0],
	          'weight': d[1]
	        };
	      });
	
	      for (var k = 0; k < this_distro.length; k++) {
	        this_distro_entry[k + 1] = omega_format(this_distro[k][0]) + " (" + prop_format(this_distro[k][1]) + ")";
	      }
	
	      distributions.push(this_distro_entry);
	    }
	
	    distributions.sort(function (a, b) {
	      return a[0] < b[0] ? -1 : a[0] == b[0] ? 0 : 1;
	    });
	
	    return distributions;
	  },
	
	  getModelRows: function getModelRows(json) {
	
	    if (!json) {
	      return [];
	    }
	
	    var table_row_data = [];
	    var omega_format = d3.format(".3r");
	    var prop_format = d3.format(".2p");
	    var p_value_format = d3.format(".4f");
	
	    for (var m in json["fits"]) {
	
	      var this_model_row = [],
	          this_model = json["fits"][m];
	
	      this_model_row = [this_model['display-order'], "", m, this.getLogLikelihood(this_model), this.getNumParameters(this_model), this.getAIC(this_model), this.getRuntime(this_model), this.getBranchLengths(this_model)];
	
	      var distributions = this.getDistributions(m, this_model);
	
	      if (distributions.length) {
	
	        this_model_row = this_model_row.concat(distributions[0]);
	        this_model_row[1] = distributions[0][0];
	
	        table_row_data.push(this_model_row);
	
	        for (var d = 1; d < distributions.length; d++) {
	
	          var this_distro_entry = this_model_row.map(function (d, i) {
	            if (i) return "";
	            return d;
	          });
	
	          this_distro_entry[1] = distributions[d][0];
	
	          for (var k = this_distro_entry.length - 4; k < this_distro_entry.length; k++) {
	            this_distro_entry[k] = distributions[d][k - this_distro_entry.length + 4];
	          }
	
	          table_row_data.push(this_distro_entry);
	        }
	      } else {
	        table_row_data.push(this_model_row);
	      }
	    }
	
	    table_row_data.sort(function (a, b) {
	      if (a[0] == b[0]) {
	        return a[1] < b[1] ? -1 : a[1] == b[1] ? 0 : 1;
	      }
	      return a[0] - b[0];
	    });
	
	    table_row_data = table_row_data.map(function (r) {
	      return r.slice(2);
	    });
	
	    return table_row_data;
	  },
	
	  getModelColumns: function getModelColumns(table_row_data) {
	
	    var model_header = '<th>Model</th>',
	        logl_header = '<th><em> log </em>L</th>',
	        num_params_header = '<th><abbr title="Number of estimated model parameters"># par.</abbr></th>',
	        aic_header = '<th><abbr title="Small Sample AIC">AIC<sub>c</sub></abbr></th>',
	        runtime_header = '<th>Time to fit</th>',
	        branch_lengths_header = '<th><abbr title="Total tree length, expected substitutions/site">L<sub>tree</sub></abbr></th>',
	        branch_set_header = '<th>Branch set</th>',
	        omega_1_header = '<th>&omega;<sub>1</sub></th>',
	        omega_2_header = '<th>&omega;<sub>2</sub></th>',
	        omega_3_header = '<th>&omega;<sub>3</sub></th>';
	
	    // inspect table_row_data and return header
	    var all_columns = [model_header, logl_header, num_params_header, aic_header, runtime_header, branch_lengths_header, branch_set_header, omega_1_header, omega_2_header, omega_3_header];
	
	    // validate each table row with its associated header
	    if (table_row_data.length == 0) {
	      return [];
	    }
	
	    // trim columns to length of table_row_data
	    column_headers = _.take(all_columns, table_row_data[0].length);
	
	    // remove all columns that have 0, null, or undefined rows
	    items = d3.transpose(table_row_data);
	
	    return column_headers;
	  },
	
	  componentDidUpdate: function componentDidUpdate() {
	
	    var model_columns = d3.select('#summary-model-header1');
	    model_columns = model_columns.selectAll("th").data(this.state.table_columns);
	    model_columns.enter().append("th");
	    model_columns.html(function (d) {
	      return d;
	    });
	
	    var model_rows = d3.select('#summary-model-table').selectAll("tr").data(this.state.table_row_data);
	    model_rows.enter().append('tr');
	    model_rows.exit().remove();
	    model_rows = model_rows.selectAll("td").data(function (d) {
	      return d;
	    });
	    model_rows.enter().append("td");
	    model_rows.html(function (d) {
	      return d;
	    });
	  },
	
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	
	    var table_row_data = this.getModelRows(nextProps.json),
	        table_columns = this.getModelColumns(table_row_data);
	
	    this.setState({
	      table_row_data: table_row_data,
	      table_columns: table_columns
	    });
	  },
	
	  render: function render() {
	
	    return React.createElement(
	      "div",
	      { className: "col-lg-12" },
	      React.createElement(
	        "ul",
	        { className: "list-group" },
	        React.createElement(
	          "li",
	          { className: "list-group-item" },
	          React.createElement(
	            "h4",
	            { className: "list-group-item-heading" },
	            React.createElement("i", { className: "fa fa-cubes", styleFormat: "margin-right: 10px" }),
	            "Model fits"
	          ),
	          React.createElement(
	            "table",
	            { className: "table table-hover table-condensed list-group-item-text", styleFormat: "margin-top:0.5em;" },
	            React.createElement("thead", { id: "summary-model-header1" }),
	            React.createElement("tbody", { id: "summary-model-table" })
	          )
	        )
	      )
	    );
	  }
	
	});
	
	// Will need to make a call to this
	// omega distributions
	function render_model_fits(json, element) {
	  React.render(React.createElement(ModelFits, { json: json }), $(element)[0]);
	}
	
	// Will need to make a call to this
	// omega distributions
	function rerender_model_fits(json, element) {
	  $(element).empty();
	  render_model_fits(json, element);
	}
	
	module.exports = ModelFits;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(54), __webpack_require__(57), __webpack_require__(15)))

/***/ },

/***/ 219:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_, d3, $) {"use strict";
	
	var React = __webpack_require__(61);
	
	var TreeSummary = React.createClass({
	  displayName: "TreeSummary",
	
	
	  getInitialState: function getInitialState() {
	
	    var table_row_data = this.getSummaryRows(this.props.json),
	        table_columns = this.getTreeSummaryColumns(table_row_data);
	
	    return {
	      table_row_data: table_row_data,
	      table_columns: table_columns
	    };
	  },
	
	  getRateClasses: function getRateClasses(branch_annotations) {
	
	    // Get count of all rate classes
	    var all_branches = _.values(branch_annotations);
	
	    return _.countBy(all_branches, function (branch) {
	      return branch.omegas.length;
	    });
	  },
	
	  getBranchProportion: function getBranchProportion(rate_classes) {
	    var sum = _.reduce(_.values(rate_classes), function (memo, num) {
	      return memo + num;
	    });
	    return _.mapObject(rate_classes, function (val, key) {
	      return d3.format(".2p")(val / sum);
	    });
	  },
	
	  getBranchLengthProportion: function getBranchLengthProportion(rate_classes, branch_annotations, total_branch_length) {
	
	    var self = this;
	
	    // get branch lengths of each rate distribution
	    //return prop_format(d[2] / total_tree_length
	
	    // Get count of all rate classes
	    var branch_lengths = _.mapObject(rate_classes, function (d) {
	      return 0;
	    });
	
	    for (var key in branch_annotations) {
	      var node = self.tree.get_node_by_name(key);
	      branch_lengths[branch_annotations[key].omegas.length] += self.tree.branch_length()(node);
	    };
	
	    return _.mapObject(branch_lengths, function (val, key) {
	      return d3.format(".2p")(val / total_branch_length);
	    });
	  },
	
	  getNumUnderSelection: function getNumUnderSelection(rate_classes, branch_annotations, test_results) {
	
	    var num_under_selection = _.mapObject(rate_classes, function (d) {
	      return 0;
	    });
	
	    for (var key in branch_annotations) {
	      num_under_selection[branch_annotations[key].omegas.length] += test_results[key]["p"] <= 0.05;
	    };
	
	    return num_under_selection;
	  },
	
	  getSummaryRows: function getSummaryRows(json) {
	
	    var self = this;
	
	    // Will need to create a tree for each fits
	    var analysis_data = json;
	
	    if (!analysis_data) {
	      return [];
	    }
	
	    // Create an array of phylotrees from fits
	    var trees = _.map(analysis_data["fits"], function (d) {
	      return d3.layout.phylotree("body")(d["tree string"]);
	    });
	    var tree = trees[0];
	
	    self.tree = tree;
	
	    //TODO : Do not hard code model here
	    var tree_length = analysis_data["fits"]["Full model"]["tree length"];
	    var branch_annotations = analysis_data["fits"]["Full model"]["branch-annotations"];
	    var test_results = analysis_data["test results"];
	
	    var rate_classes = this.getRateClasses(branch_annotations),
	        proportions = this.getBranchProportion(rate_classes),
	        length_proportions = this.getBranchLengthProportion(rate_classes, branch_annotations, tree_length),
	        num_under_selection = this.getNumUnderSelection(rate_classes, branch_annotations, test_results);
	
	    // zip objects into matrix
	    var keys = _.keys(rate_classes);
	
	    var summary_rows = _.zip(keys, _.values(rate_classes), _.values(proportions), _.values(length_proportions), _.values(num_under_selection));
	
	    summary_rows.sort(function (a, b) {
	      if (a[0] == b[0]) {
	        return a[1] < b[1] ? -1 : a[1] == b[1] ? 0 : 1;
	      }
	      return a[0] - b[0];
	    });
	
	    return summary_rows;
	  },
	
	  getTreeSummaryColumns: function getTreeSummaryColumns(table_row_data) {
	
	    var omega_header = '<th>ω rate<br>classes</th>',
	        branch_num_header = '<th># of <br>branches</th>',
	        branch_prop_header = '<th>% of <br>branches</th>',
	        branch_prop_length_header = '<th>% of tree <br>length</th>',
	        under_selection_header = '<th># under <br>selection</th>';
	
	    // inspect table_row_data and return header
	    var all_columns = [omega_header, branch_num_header, branch_prop_header, branch_prop_length_header, under_selection_header];
	
	    // validate each table row with its associated header
	    if (table_row_data.length == 0) {
	      return [];
	    }
	
	    // trim columns to length of table_row_data
	    column_headers = _.take(all_columns, table_row_data[0].length);
	
	    return column_headers;
	  },
	
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	
	    var table_row_data = this.getSummaryRows(nextProps.json),
	        table_columns = this.getTreeSummaryColumns(table_row_data);
	
	    this.setState({
	      table_row_data: table_row_data,
	      table_columns: table_columns
	    });
	  },
	
	  componentDidUpdate: function componentDidUpdate() {
	
	    d3.select('#summary-tree-header').empty();
	
	    var tree_summary_columns = d3.select('#summary-tree-header');
	
	    tree_summary_columns = tree_summary_columns.selectAll("th").data(this.state.table_columns);
	    tree_summary_columns.enter().append("th");
	    tree_summary_columns.html(function (d) {
	      return d;
	    });
	
	    var tree_summary_rows = d3.select('#summary-tree-table').selectAll("tr").data(this.state.table_row_data);
	    tree_summary_rows.enter().append('tr');
	    tree_summary_rows.exit().remove();
	    tree_summary_rows = tree_summary_rows.selectAll("td").data(function (d) {
	      return d;
	    });
	
	    tree_summary_rows.enter().append("td");
	    tree_summary_rows.html(function (d) {
	      return d;
	    });
	  },
	
	  render: function render() {
	
	    return React.createElement(
	      "ul",
	      { className: "list-group" },
	      React.createElement(
	        "li",
	        { className: "list-group-item" },
	        React.createElement(
	          "h4",
	          { className: "list-group-item-heading" },
	          React.createElement("i", { className: "fa fa-tree" }),
	          "Tree"
	        ),
	        React.createElement(
	          "table",
	          { className: "table table-hover table-condensed list-group-item-text" },
	          React.createElement("thead", { id: "summary-tree-header" }),
	          React.createElement("tbody", { id: "summary-tree-table" })
	        )
	      )
	    );
	  }
	
	});
	
	//TODO
	//<caption>
	//<p className="list-group-item-text text-muted">
	//    Total tree length under the branch-site model is <strong id="summary-tree-length">2.30</strong> expected substitutions per nucleotide site, and <strong id="summary-tree-length-mg94">1.74</strong> under the MG94 model.
	//</p>
	//</caption>
	
	
	// Will need to make a call to this
	// omega distributions
	function render_tree_summary(json, element) {
	  React.render(React.createElement(TreeSummary, { json: json }), $(element)[0]);
	}
	
	// Will need to make a call to this
	// omega distributions
	function rerender_tree_summary(tree, element) {
	  $(element).empty();
	  render_tree_summary(tree, element);
	}
	
	module.exports = TreeSummary;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(57), __webpack_require__(54), __webpack_require__(15)))

/***/ },

/***/ 220:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3, _, $) {'use strict';
	
	var React = __webpack_require__(61);
	
	var datamonkey = __webpack_require__(53);
	
	var Tree = React.createClass({
	    displayName: 'Tree',
	
	
	    getInitialState: function getInitialState() {
	        return {
	            json: this.props.json,
	            settings: this.props.settings
	        };
	    },
	
	    sortNodes: function sortNodes(asc) {
	
	        var self = this;
	
	        self.tree.traverse_and_compute(function (n) {
	            var d = 1;
	            if (n.children && n.children.length) {
	                d += d3.max(n.children, function (d) {
	                    return d["count_depth"];
	                });
	            }
	            n["count_depth"] = d;
	        });
	
	        self.tree.resort_children(function (a, b) {
	            return (a["count_depth"] - b["count_depth"]) * (asc ? 1 : -1);
	        });
	    },
	
	    getBranchLengths: function getBranchLengths() {
	
	        var self = this;
	
	        if (!this.state.json) {
	            return [];
	        }
	
	        var branch_lengths = self.settings["tree-options"]["hyphy-tree-branch-lengths"][0] ? this.state.json["fits"][this.which_model]["branch-lengths"] : null;
	
	        if (!branch_lengths) {
	
	            var nodes = _.filter(self.tree.get_nodes(), function (d) {
	                return d.parent;
	            });
	
	            branch_lengths = _.object(_.map(nodes, function (d) {
	                return d.name;
	            }), _.map(nodes, function (d) {
	                return parseFloat(d.attribute);
	            }));
	        }
	
	        return branch_lengths;
	    },
	
	    assignBranchAnnotations: function assignBranchAnnotations() {
	        if (this.state.json && this.state.json["fits"][this.which_model]) {
	            this.tree.assign_attributes(this.state.json["fits"][this.which_model]["branch-annotations"]);
	        }
	    },
	
	    renderDiscreteLegendColorScheme: function renderDiscreteLegendColorScheme(svg_container) {
	
	        var self = this,
	            svg = self.svg;
	
	        var color_fill = self.settings["tree-options"]["hyphy-tree-fill-color"][0] ? "black" : "red";
	
	        var margins = {
	            'bottom': 30,
	            'top': 15,
	            'left': 40,
	            'right': 2
	        };
	
	        d3.selectAll("#color-legend").remove();
	
	        var dc_legend = svg.append("g").attr("id", "color-legend").attr("class", "dc-legend").attr("transform", "translate(" + margins["left"] + "," + margins["top"] + ")");
	
	        var fg_item = dc_legend.append("g").attr("class", "dc-legend-item").attr("transform", "translate(0,0)");
	
	        fg_item.append("rect").attr("width", "13").attr("height", "13").attr("fill", color_fill);
	
	        fg_item.append("text").attr("x", "15").attr("y", "11").text("Foreground");
	
	        var bg_item = dc_legend.append("g").attr("class", "dc-legend-item").attr("transform", "translate(0,18)");
	
	        bg_item.append("rect").attr("width", "13").attr("height", "13").attr("fill", "gray");
	
	        bg_item.append("text").attr("x", "15").attr("y", "11").text("Background");
	    },
	
	    renderLegendColorScheme: function renderLegendColorScheme(svg_container, attr_name, do_not_render) {
	
	        var self = this;
	
	        var branch_annotations = this.state.json["fits"][this.which_model]["branch-annotations"];
	
	        var svg = self.svg;
	
	        // clear existing linearGradients
	        d3.selectAll(".legend-definitions").selectAll("linearGradient").remove();
	        d3.selectAll("#color-legend").remove();
	
	        if (branch_annotations && !do_not_render) {
	            var bar_width = 70,
	                bar_height = 300,
	                margins = {
	                'bottom': 30,
	                'top': 15,
	                'left': 40,
	                'right': 2
	            };
	
	            this_grad = svg.append("defs").attr("class", "legend-definitions").append("linearGradient").attr("id", "_omega_bar").attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
	
	            var omega_scale = d3.scale.pow().exponent(this.scaling_exponent).domain(d3.extent(self.omega_color.domain())).range([0, 1]),
	                axis_scale = d3.scale.pow().exponent(this.scaling_exponent).domain(d3.extent(self.omega_color.domain())).range([0, bar_height - margins['top'] - margins['bottom']]);
	
	            self.omega_color.domain().forEach(function (d) {
	                this_grad.append("stop").attr("offset", "" + omega_scale(d) * 100 + "%").style("stop-color", self.omega_color(d));
	            });
	
	            var g_container = svg.append("g").attr("id", "color-legend").attr("transform", "translate(" + margins["left"] + "," + margins["top"] + ")");
	
	            g_container.append("rect").attr("x", 0).attr("width", bar_width - margins['left'] - margins['right']).attr("y", 0).attr("height", bar_height - margins['top'] - margins['bottom']).style("fill", "url(#_omega_bar)");
	
	            var draw_omega_bar = d3.svg.axis().scale(axis_scale).orient("left").tickFormat(d3.format(".1r")).tickValues([0, 0.01, 0.1, 0.5, 1, 2, 5, 10]);
	
	            var scale_bar = g_container.append("g");
	
	            scale_bar.style("font-size", "14").attr("class", "hyphy-omega-bar").call(draw_omega_bar);
	
	            scale_bar.selectAll("text").style("text-anchor", "right");
	
	            var x_label = _label = scale_bar.append("g").attr("class", "hyphy-omega-bar");
	            x_label = x_label.selectAll("text").data([attr_name]);
	            x_label.enter().append("text");
	            x_label.text(function (d) {
	                return $('<textarea />').html(d).text();
	            }).attr("transform", "translate(" + (bar_width - margins['left'] - margins['right']) * 0.5 + "," + (bar_height - margins['bottom']) + ")").style("text-anchor", "middle").style("font-size", "18").attr("dx", "0.0em").attr("dy", "0.1em");
	        }
	    },
	
	    setHandlers: function setHandlers() {
	
	        var self = this;
	
	        $("#hyphy-error-hide").on("click", function (e) {
	            d3.select("#hyphy-error").style("display", "none");
	            e.preventDefault();
	        });
	
	        $(".hyphy-tree-trigger").on("click", function (e) {
	
	            self.renderTree();
	        });
	
	        $(".tree-tab-btn").on('click', function (e) {
	            self.tree.placenodes().update();
	        });
	
	        $("#export-phylo-svg").on('click', function (e) {
	            datamonkey.save_image("svg", "#tree_container");
	        });
	
	        $("#export-phylo-png").on('click', function (e) {
	            datamonkey.save_image("png", "#tree_container");
	        });
	
	        $("#export-phylo-nwk").on('click', function (e) {
	            var nwk = self.tree.get_newick(function () {});
	            var pom = document.createElement('a');
	            pom.setAttribute('href', 'data:text/octet-stream;charset=utf-8,' + encodeURIComponent(nwk));
	            pom.setAttribute('download', 'nwk.txt');
	            $("body").append(pom);
	            pom.click();
	            pom.remove();
	        });
	    },
	
	    setTreeHandlers: function setTreeHandlers() {
	
	        var self = this;
	        var tree_object = self.tree;
	
	        $("[data-direction]").on("click", function (e) {
	            var which_function = $(this).data("direction") == 'vertical' ? tree_object.spacing_x : tree_object.spacing_y;
	            which_function(which_function() + +$(this).data("amount")).update();
	        });
	
	        $(".phylotree-layout-mode").on("change", function (e) {
	            if ($(this).is(':checked')) {
	                if (tree_object.radial() != ($(this).data("mode") == "radial")) {
	                    tree_object.radial(!tree_object.radial()).placenodes().update();
	                }
	            }
	        });
	
	        $(".phylotree-align-toggler").on("change", function (e) {
	            if ($(this).is(':checked')) {
	                if (tree_object.align_tips($(this).data("align") == "right")) {
	                    tree_object.placenodes().update();
	                }
	            }
	        });
	
	        $("#sort_original").on("click", function (e) {
	            tree_object.resort_children(function (a, b) {
	                return a["original_child_order"] - b["original_child_order"];
	            });
	
	            e.preventDefault();
	        });
	
	        $("#sort_ascending").on("click", function (e) {
	            self.sortNodes(true);
	            e.preventDefault();
	        });
	
	        $("#sort_descending").on("click", function (e) {
	            self.sortNodes(false);
	            e.preventDefault();
	        });
	    },
	
	    setPartitionList: function setPartitionList() {
	
	        var self = this;
	
	        // Check if partition list exists
	        if (!self.props.json["partition"]) {
	            d3.select("#hyphy-tree-highlight-div").style("display", "none");
	            d3.select("#hyphy-tree-highlight").style("display", "none");
	            return;
	        }
	
	        // set tree partitions
	        self.tree.set_partitions(self.props.json["partition"]);
	
	        var partition_list = d3.select("#hyphy-tree-highlight-branches").selectAll("li").data([['None']].concat(d3.keys(self.props.json["partition"]).map(function (d) {
	            return [d];
	        }).sort()));
	
	        partition_list.enter().append("li");
	        partition_list.exit().remove();
	        partition_list = partition_list.selectAll("a").data(function (d) {
	            return d;
	        });
	
	        partition_list.enter().append("a");
	        partition_list.attr("href", "#").on("click", function (d, i) {
	            d3.select("#hyphy-tree-highlight").attr("value", d);
	            self.renderTree();
	        });
	
	        // set default to passed setting
	        partition_list.text(function (d) {
	            if (d == "RELAX.test") {
	                this.click();
	            }
	            return d;
	        });
	    },
	
	    setModelList: function setModelList() {
	
	        var self = this;
	
	        if (!this.state.json) {
	            return [];
	        }
	
	        this.state.settings['suppress-tree-render'] = true;
	
	        var def_displayed = false;
	
	        var model_list = d3.select("#hyphy-tree-model-list").selectAll("li").data(d3.keys(this.state.json["fits"]).map(function (d) {
	            return [d];
	        }).sort());
	
	        model_list.enter().append("li");
	        model_list.exit().remove();
	        model_list = model_list.selectAll("a").data(function (d) {
	            return d;
	        });
	
	        model_list.enter().append("a");
	
	        model_list.attr("href", "#").on("click", function (d, i) {
	            d3.select("#hyphy-tree-model").attr("value", d);
	            self.renderTree();
	        });
	
	        model_list.text(function (d) {
	
	            if (d == "General Descriptive") {
	                def_displayed = true;
	                this.click();
	            }
	
	            if (!def_displayed && d == "Alternative") {
	                def_displayed = true;
	                this.click();
	            }
	
	            if (!def_displayed && d == "Partitioned MG94xREV") {
	                def_displayed = true;
	                this.click();
	            }
	
	            if (!def_displayed && d == "MG94") {
	                def_displayed = true;
	                this.click();
	            }
	
	            if (!def_displayed && d == "Full model") {
	                def_displayed = true;
	                this.click();
	            }
	
	            return d;
	        });
	
	        this.settings['suppress-tree-render'] = false;
	    },
	
	    initialize: function initialize() {
	
	        var self = this;
	
	        this.settings = this.state.settings;
	
	        if (!this.settings) {
	            return null;
	        }
	
	        if (!this.state.json) {
	            return null;
	        }
	
	        $("#hyphy-tree-branch-lengths").click();
	
	        this.scaling_exponent = 0.33;
	        this.omega_format = d3.format(".3r");
	        this.prop_format = d3.format(".2p");
	        this.fit_format = d3.format(".2f");
	        this.p_value_format = d3.format(".4f");
	
	        var json = this.state.json;
	        var analysis_data = json;
	
	        this.width = 800;
	        this.height = 600;
	
	        this.which_model = this.settings["tree-options"]["hyphy-tree-model"][0];
	        this.legend_type = this.settings["hyphy-tree-legend-type"];
	
	        this.setHandlers();
	        this.setModelList();
	        this.initializeTree();
	        this.setPartitionList();
	    },
	
	    initializeTree: function initializeTree() {
	
	        var self = this;
	
	        var analysis_data = self.state.json;
	
	        var width = this.width,
	            height = this.height,
	            alpha_level = 0.05,
	            branch_lengths = [];
	
	        if (!this.tree) {
	            this.tree = d3.layout.phylotree("body").size([height, width]).separation(function (a, b) {
	                return 0;
	            });
	        }
	
	        this.setTreeHandlers();
	
	        // clear any existing svg
	        d3.select("#tree_container").html("");
	
	        this.svg = d3.select("#tree_container").append("svg").attr("width", width).attr("height", height);
	
	        this.tree.branch_name(null);
	        this.tree.node_span('equal');
	        this.tree.options({
	            'draw-size-bubbles': false,
	            'selectable': false,
	            'left-right-spacing': 'fit-to-size',
	            'left-offset': 100,
	            'color-fill': this.settings["tree-options"]["hyphy-tree-fill-color"][0]
	        }, false);
	
	        this.assignBranchAnnotations();
	
	        self.omega_color = d3.scale.pow().exponent(this.scaling_exponent).domain([0, 0.25, 1, 5, 10]).range(this.settings["tree-options"]["hyphy-tree-fill-color"][0] ? ["#DDDDDD", "#AAAAAA", "#888888", "#444444", "#000000"] : ["#5e4fa2", "#3288bd", "#e6f598", "#f46d43", "#9e0142"]).clamp(true);
	
	        self.renderTree();
	
	        if (self.legend_type == 'discrete') {
	            self.renderDiscreteLegendColorScheme("tree_container");
	        } else {
	            self.renderLegendColorScheme("tree_container", analysis_data["fits"][this.which_model]["annotation-tag"]);
	        }
	
	        if (this.settings.edgeColorizer) {
	            this.edgeColorizer = this.settings.edgeColorizer;
	        }
	
	        this.tree.style_edges(this.edgeColorizer);
	        this.tree.style_nodes(this.nodeColorizer);
	
	        this.tree.spacing_x(30, true);
	        this.tree.layout();
	        this.tree.placenodes().update();
	        this.tree.layout();
	    },
	
	    renderTree: function renderTree(skip_render) {
	
	        var self = this;
	        var analysis_data = this.state.json;
	        var svg = self.svg;
	
	        if (!this.settings['suppress-tree-render']) {
	
	            var do_layout = false;
	
	            for (var k in this.settings["tree-options"]) {
	
	                //TODO : Check to make sure settings has a matching field
	                if (k == 'hyphy-tree-model') {
	
	                    var controller = d3.select("#" + k),
	                        controller_value = controller.attr("value") || controller.property("checked");
	
	                    if (controller_value != this.settings["tree-options"][k][0] && controller_value != false) {
	                        this.settings["tree-options"][k][0] = controller_value;
	                        do_layout = do_layout || this.settings["tree-options"][k][1];
	                    }
	                } else {
	                    var controller = d3.select("#" + k),
	                        controller_value = controller.attr("value") || controller.property("checked");
	
	                    if (controller_value != this.settings["tree-options"][k][0]) {
	                        this.settings["tree-options"][k][0] = controller_value;
	                        do_layout = do_layout || this.settings["tree-options"][k][1];
	                    }
	                }
	            }
	
	            // Update which_model
	            if (self.which_model != this.settings["tree-options"]["hyphy-tree-model"][0]) {
	                self.which_model = this.settings["tree-options"]["hyphy-tree-model"][0];
	                self.initializeTree();
	                return;
	            }
	
	            if (_.indexOf(_.keys(analysis_data), "tree") > -1) {
	                this.tree(analysis_data["tree"]).svg(svg);
	            } else {
	                this.tree(analysis_data["fits"][self.which_model]["tree string"]).svg(svg);
	            }
	
	            this.branch_lengths = this.getBranchLengths();
	
	            this.tree.font_size(18);
	            this.tree.scale_bar_font_size(14);
	            this.tree.node_circle_size(0);
	
	            this.tree.branch_length(function (n) {
	                if (self.branch_lengths) {
	                    return self.branch_lengths[n.name] || 0;
	                }
	                return undefined;
	            });
	
	            this.assignBranchAnnotations();
	
	            if (_.findKey(analysis_data, "partition")) {
	                this.partition = (this.settings["tree-options"]["hyphy-tree-highlight"] ? analysis_data["partition"][this.settings["tree-options"]["hyphy-tree-highlight"][0]] : null) || null;
	            } else {
	                this.partition = null;
	            }
	
	            self.omega_color = d3.scale.pow().exponent(self.scaling_exponent).domain([0, 0.25, 1, 5, 10]).range(self.settings["tree-options"]["hyphy-tree-fill-color"][0] ? ["#DDDDDD", "#AAAAAA", "#888888", "#444444", "#000000"] : ["#5e4fa2", "#3288bd", "#e6f598", "#f46d43", "#9e0142"]).clamp(true);
	
	            self.tree.options({
	                'color-fill': self.settings["tree-options"]["hyphy-tree-fill-color"][0]
	            }, false);
	
	            d3.select(".phylotree-definitions").selectAll("linearGradient").remove();
	
	            // TODO: Should be a prop. Hide or show legend.
	            if (!this.settings["tree-options"]["hyphy-tree-hide-legend"][0]) {
	                d3.select("#color-legend").style("visibility", "visible");
	
	                if (self.legend_type) {
	                    self.renderDiscreteLegendColorScheme("tree_container");
	                } else {
	                    self.renderLegendColorScheme("tree_container", self.state.json["fits"][self.which_model]["annotation-tag"]);
	                }
	            } else {
	                d3.select("#color-legend").style("visibility", "hidden");
	            }
	
	            if (!skip_render) {
	                if (do_layout) {
	                    this.tree.update_layout();
	                }
	                d3_phylotree_trigger_refresh(this.tree);
	            }
	        }
	    },
	
	    componentDidMount: function componentDidMount() {
	        this.initialize();
	    },
	
	    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	
	        this.setState({
	            json: nextProps.json,
	            settings: nextProps.settings
	        });
	    },
	
	    componentDidUpdate: function componentDidUpdate() {
	        this.initialize();
	    },
	
	    render: function render() {
	
	        return React.createElement(
	            'div',
	            null,
	            React.createElement(
	                'div',
	                { className: 'row' },
	                React.createElement(
	                    'div',
	                    { className: 'cold-md-12' },
	                    React.createElement(
	                        'div',
	                        { className: 'input-group input-group-sm' },
	                        React.createElement(
	                            'div',
	                            { className: 'input-group-btn' },
	                            React.createElement(
	                                'button',
	                                { type: 'button', className: 'btn btn-default dropdown-toggle', 'data-toggle': 'dropdown' },
	                                'Export',
	                                React.createElement('span', { className: 'caret' })
	                            ),
	                            React.createElement(
	                                'ul',
	                                { className: 'dropdown-menu' },
	                                React.createElement(
	                                    'li',
	                                    { id: 'export-phylo-png' },
	                                    React.createElement(
	                                        'a',
	                                        { href: '#' },
	                                        React.createElement('i', { className: 'fa fa-image' }),
	                                        ' Image'
	                                    )
	                                ),
	                                React.createElement(
	                                    'li',
	                                    { id: 'export-phylo-nwk' },
	                                    React.createElement(
	                                        'a',
	                                        { href: '#' },
	                                        React.createElement('i', { className: 'fa fa-file-o' }),
	                                        ' Newick File'
	                                    )
	                                )
	                            ),
	                            React.createElement(
	                                'button',
	                                { type: 'button', className: 'btn btn-default btn-sm', 'data-direction': 'vertical', 'data-amount': '1', title: 'Expand vertical spacing' },
	                                React.createElement('i', { className: 'fa fa-arrows-v' })
	                            ),
	                            React.createElement(
	                                'button',
	                                { type: 'button', className: 'btn btn-default btn-sm', 'data-direction': 'vertical', 'data-amount': '-1', title: 'Compress vertical spacing' },
	                                React.createElement('i', { className: 'fa  fa-compress fa-rotate-135' })
	                            ),
	                            React.createElement(
	                                'button',
	                                { type: 'button', className: 'btn btn-default btn-sm', 'data-direction': 'horizontal', 'data-amount': '1', title: 'Expand horizonal spacing' },
	                                React.createElement('i', { className: 'fa fa-arrows-h' })
	                            ),
	                            React.createElement(
	                                'button',
	                                { type: 'button', className: 'btn btn-default btn-sm', 'data-direction': 'horizontal', 'data-amount': '-1', title: 'Compress horizonal spacing' },
	                                React.createElement('i', { className: 'fa  fa-compress fa-rotate-45' })
	                            ),
	                            React.createElement(
	                                'button',
	                                { type: 'button', className: 'btn btn-default btn-sm', id: 'sort_ascending', title: 'Sort deepest clades to the bototm' },
	                                React.createElement('i', { className: 'fa fa-sort-amount-asc' })
	                            ),
	                            React.createElement(
	                                'button',
	                                { type: 'button', className: 'btn btn-default btn-sm', id: 'sort_descending', title: 'Sort deepsest clades to the top' },
	                                React.createElement('i', { className: 'fa fa-sort-amount-desc' })
	                            ),
	                            React.createElement(
	                                'button',
	                                { type: 'button', className: 'btn btn-default btn-sm', id: 'sort_original', title: 'Restore original order' },
	                                React.createElement('i', { className: 'fa fa-sort' })
	                            )
	                        ),
	                        React.createElement(
	                            'div',
	                            { className: 'input-group-btn', 'data-toggle': 'buttons' },
	                            React.createElement(
	                                'label',
	                                { className: 'btn btn-default active btn-sm' },
	                                React.createElement('input', { type: 'radio', name: 'options', className: 'phylotree-layout-mode', 'data-mode': 'linear', autoComplete: 'off', checked: '', title: 'Layout left-to-right' }),
	                                'Linear'
	                            ),
	                            React.createElement(
	                                'label',
	                                { className: 'btn btn-default  btn-sm' },
	                                React.createElement('input', { type: 'radio', name: 'options', className: 'phylotree-layout-mode', 'data-mode': 'radial', autoComplete: 'off', title: 'Layout radially' }),
	                                ' Radial'
	                            )
	                        ),
	                        React.createElement(
	                            'div',
	                            { className: 'input-group-btn', 'data-toggle': 'buttons' },
	                            React.createElement(
	                                'label',
	                                { className: 'btn btn-default active btn-sm' },
	                                React.createElement('input', { type: 'radio', className: 'phylotree-align-toggler', 'data-align': 'left', name: 'options-align', autoComplete: 'off', checked: '', title: 'Align tips labels to branches' }),
	                                React.createElement('i', { className: 'fa fa-align-left' })
	                            ),
	                            React.createElement(
	                                'label',
	                                { className: 'btn btn-default btn-sm' },
	                                React.createElement('input', { type: 'radio', className: 'phylotree-align-toggler', 'data-align': 'right', name: 'options-align', autoComplete: 'off', title: 'Align tips labels to the edge of the plot' }),
	                                React.createElement('i', { className: 'fa fa-align-right' })
	                            )
	                        ),
	                        React.createElement(
	                            'div',
	                            { className: 'input-group-btn' },
	                            React.createElement(
	                                'button',
	                                { type: 'button', className: 'btn btn-default dropdown-toggle', 'data-toggle': 'dropdown' },
	                                'Model',
	                                React.createElement('span', { className: 'caret' })
	                            ),
	                            React.createElement('ul', { className: 'dropdown-menu', id: 'hyphy-tree-model-list' })
	                        ),
	                        React.createElement('input', { type: 'text', className: 'form-control disabled', id: 'hyphy-tree-model', disabled: true }),
	                        React.createElement(
	                            'div',
	                            { id: 'hyphy-tree-highlight-div', className: 'input-group-btn' },
	                            React.createElement(
	                                'button',
	                                { type: 'button', className: 'btn btn-default dropdown-toggle', 'data-toggle': 'dropdown' },
	                                'Highlight branch set',
	                                React.createElement('span', { className: 'caret' })
	                            ),
	                            React.createElement('ul', { className: 'dropdown-menu', id: 'hyphy-tree-highlight-branches' })
	                        ),
	                        React.createElement('input', { type: 'text', className: 'form-control disabled', id: 'hyphy-tree-highlight', disabled: true }),
	                        React.createElement(
	                            'span',
	                            { className: 'input-group-addon' },
	                            'Use model branch lengths',
	                            React.createElement('input', { type: 'checkbox', id: 'hyphy-tree-branch-lengths', className: 'hyphy-tree-trigger' })
	                        ),
	                        React.createElement(
	                            'span',
	                            { className: 'input-group-addon' },
	                            'Hide legend',
	                            React.createElement('input', { type: 'checkbox', id: 'hyphy-tree-hide-legend', className: 'hyphy-tree-trigger' })
	                        ),
	                        React.createElement(
	                            'span',
	                            { className: 'input-group-addon' },
	                            'Grayscale',
	                            React.createElement('input', { type: 'checkbox', id: 'hyphy-tree-fill-color', className: 'hyphy-tree-trigger' })
	                        )
	                    )
	                )
	            ),
	            React.createElement(
	                'div',
	                { className: 'row' },
	                React.createElement(
	                    'div',
	                    { className: 'col-md-12' },
	                    React.createElement(
	                        'div',
	                        { className: 'row' },
	                        React.createElement('div', { id: 'tree_container', className: 'tree-widget' })
	                    )
	                )
	            )
	        );
	    }
	
	});
	
	function render_tree(json, element, settings) {
	
	    return React.render(React.createElement(Tree, { json: json, settings: settings }), $(element)[0]);
	}
	
	function rerender_tree(json, element, settings) {
	
	    $(element).empty();
	    return render_tree(json, settings);
	}
	
	module.exports = Tree;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(54), __webpack_require__(57), __webpack_require__(15)))

/***/ },

/***/ 221:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_, d3, $) {"use strict";
	
	var React = __webpack_require__(61);
	__webpack_require__(222);
	
	var BranchTable = React.createClass({
	  displayName: "BranchTable",
	
	
	  getInitialState: function getInitialState() {
	
	    // add the following
	    var table_row_data = this.getBranchRows(this.props.tree, this.props.test_results, this.props.annotations),
	        table_columns = this.getBranchColumns(table_row_data),
	        initial_model_name = _.take(_.keys(this.props.annotations)),
	        initial_omegas = this.props.annotations ? this.props.annotations[initial_model_name]["omegas"] : null;
	
	    var distro_settings = {
	      dimensions: { width: 600, height: 400 },
	      margins: { 'left': 50, 'right': 15, 'bottom': 15, 'top': 35 },
	      legend: false,
	      domain: [0.00001, 10000],
	      do_log_plot: true,
	      k_p: null,
	      plot: null,
	      svg_id: "prop-chart"
	    };
	
	    return {
	      tree: this.props.tree,
	      test_results: this.props.test_results,
	      annotations: this.props.annotations,
	      table_row_data: table_row_data,
	      table_columns: table_columns,
	      current_model_name: initial_model_name,
	      current_omegas: initial_omegas,
	      distro_settings: distro_settings
	    };
	  },
	
	  getBranchLength: function getBranchLength(m) {
	
	    if (!this.state.tree) {
	      return '';
	    }
	
	    return d3.format(".4f")(this.state.tree.get_node_by_name(m).attribute);
	  },
	
	  getLRT: function getLRT(branch) {
	    var formatted = d3.format(".4f")(branch["LRT"]);
	    if (formatted == "NaN") {
	      return branch["LRT"];
	    } else {
	      return formatted;
	    }
	  },
	
	  getPVal: function getPVal(branch) {
	    return d3.format(".4f")(branch["p"]);
	  },
	
	  getUncorrectedPVal: function getUncorrectedPVal(branch) {
	    return d3.format(".4f")(branch["uncorrected p"]);
	  },
	
	  getOmegaDistribution: function getOmegaDistribution(m, annotations) {
	
	    if (!annotations) {
	      return '';
	    }
	
	    var omega_string = "";
	
	    for (var i in annotations[m]["omegas"]) {
	      var omega = parseFloat(annotations[m]["omegas"][i]["omega"]);
	      var formatted_omega = "∞";
	      if (omega < 1e+20) {
	        formatted_omega = d3.format(".3r")(omega);
	      }
	      omega_string += "&omega;<sub>" + (parseInt(i) + 1) + "</sub> = " + formatted_omega + " (" + d3.format(".2p")(annotations[m]["omegas"][i]["prop"]) + ")<br/>";
	    }
	
	    return omega_string;
	  },
	
	  getBranchRows: function getBranchRows(tree, test_results, annotations) {
	
	    var self = this;
	
	    var table_row_data = [],
	        omega_format = d3.format(".3r"),
	        prop_format = d3.format(".2p");
	
	    for (var m in test_results) {
	
	      var branch_row = [];
	      branch = test_results[m];
	
	      branch_row = [m, this.getBranchLength(m), this.getLRT(branch), this.getPVal(branch), this.getUncorrectedPVal(branch), this.getOmegaDistribution(m, annotations)];
	
	      table_row_data.push(branch_row);
	    }
	
	    table_row_data.sort(function (a, b) {
	
	      if (a[0] == b[0]) {
	        return a[1] < b[1] ? -1 : a[1] == b[1] ? 0 : 1;
	      }
	
	      return a[3] - b[3];
	    });
	
	    return table_row_data;
	  },
	
	  setEvents: function setEvents() {
	
	    var self = this;
	
	    if (self.state.annotations) {
	      var branch_table = d3.select('#table-branch-table').selectAll("tr");
	
	      branch_table.on("click", function (d) {
	        var label = d[0];
	        self.setState({
	          current_model_name: label,
	          current_omegas: self.state.annotations[label]["omegas"]
	        });
	      });
	    }
	  },
	
	  createDistroChart: function createDistroChart() {
	
	    var self = this;
	
	    this.settings = {
	      dimensions: { width: 600, height: 400 },
	      margins: { 'left': 50, 'right': 15, 'bottom': 15, 'top': 15 },
	      has_zeros: true,
	      legend_id: null,
	      do_log_plot: true,
	      k_p: null,
	      plot: null,
	      svg_id: "prop-chart"
	    };
	  },
	
	  getBranchColumns: function getBranchColumns(table_row_data) {
	
	    if (table_row_data.length <= 0) {
	      return null;
	    }
	
	    var name_header = '<th>Name</th>',
	        length_header = '<th><abbr title="Branch Length">B</abbr></th>',
	        lrt_header = '<th><abbr title="Likelihood ratio test statistic">LRT</abbr></th>',
	        pvalue_header = '<th>Test p-value</th>',
	        uncorrected_pvalue_header = '<th>Uncorrected p-value</th>',
	        omega_header = '<th>ω distribution over sites</th>';
	
	    // inspect table_row_data and return header
	    all_columns = [name_header, length_header, lrt_header, pvalue_header, uncorrected_pvalue_header, omega_header];
	
	    // validate each table row with its associated header
	
	    // trim columns to length of table_row_data
	    column_headers = _.take(all_columns, table_row_data[0].length);
	
	    // remove all columns that have 0, null, or undefined rows
	    items = d3.transpose(table_row_data);
	
	    return column_headers;
	  },
	
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	
	    var table_row_data = this.getBranchRows(nextProps.tree, nextProps.test_results, nextProps.annotations),
	        table_columns = this.getBranchColumns(table_row_data),
	        initial_model_name = _.take(_.keys(nextProps.annotations)),
	        initial_omegas = nextProps.annotations ? nextProps.annotations[initial_model_name]["omegas"] : null;
	
	    var distro_settings = {
	      dimensions: { width: 600, height: 400 },
	      margins: { 'left': 50, 'right': 15, 'bottom': 15, 'top': 15 },
	      legend: false,
	      domain: [0.00001, 10000],
	      do_log_plot: true,
	      k_p: null,
	      plot: null,
	      svg_id: "prop-chart"
	    };
	
	    if (nextProps.test_results && nextProps.annotations) {
	      this.setState({
	        tree: nextProps.tree,
	        test_results: nextProps.test_results,
	        annotations: nextProps.annotations,
	        table_row_data: table_row_data,
	        table_columns: table_columns,
	        current_model_name: initial_model_name,
	        current_omegas: initial_omegas,
	        distro_settings: distro_settings
	      });
	    }
	  },
	
	  componentDidUpdate: function componentDidUpdate() {
	
	    var branch_columns = d3.select('#table-branch-header');
	    branch_columns = branch_columns.selectAll("th").data(this.state.table_columns);
	    branch_columns.enter().append("th");
	
	    branch_columns.html(function (d) {
	      return d;
	    });
	
	    var branch_rows = d3.select('#table-branch-table').selectAll("tr").data(this.state.table_row_data);
	
	    branch_rows.enter().append('tr');
	    branch_rows.exit().remove();
	    branch_rows.style('font-weight', function (d) {
	      return d[3] <= 0.05 ? 'bold' : 'normal';
	    });
	
	    branch_rows = branch_rows.selectAll("td").data(function (d) {
	      return d;
	    });
	
	    branch_rows.enter().append("td");
	    branch_rows.html(function (d) {
	      return d;
	    });
	
	    this.createDistroChart();
	    this.setEvents();
	  },
	
	  render: function render() {
	
	    var self = this;
	
	    return React.createElement(
	      "div",
	      { className: "row" },
	      React.createElement(
	        "div",
	        { id: "hyphy-branch-table", className: "col-md-7" },
	        React.createElement(
	          "table",
	          { className: "table table-hover table-condensed" },
	          React.createElement("thead", { id: "table-branch-header" }),
	          React.createElement("tbody", { id: "table-branch-table" })
	        )
	      ),
	      React.createElement(
	        "div",
	        { id: "primary-omega-tag", className: "col-md-5" },
	        React.createElement(PropChart, { name: self.state.current_model_name, omegas: self.state.current_omegas,
	          settings: self.state.distro_settings })
	      )
	    );
	  }
	
	});
	
	// Will need to make a call to this
	// omega distributions
	function render_branch_table(tree, test_results, annotations, element) {
	  React.render(React.createElement(BranchTable, { tree: tree, test_results: test_results, annotations: annotations }), $(element)[0]);
	}
	
	// Will need to make a call to this
	// omega distributions
	function rerender_branch_table(tree, test_results, annotations, element) {
	  $(element).empty();
	  render_branch_table(tree, test_results, annotations, element);
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(57), __webpack_require__(54), __webpack_require__(15)))

/***/ },

/***/ 222:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3, _, $) {'use strict';
	
	var React = __webpack_require__(61);
	var datamonkey = __webpack_require__(53);
	
	var PropChart = React.createClass({
	    displayName: 'PropChart',
	
	
	    getDefaultProps: function getDefaultProps() {
	        return {
	            svg_id: null,
	            dimensions: { width: 600, height: 400 },
	            margins: { 'left': 50, 'right': 15, 'bottom': 25, 'top': 35 },
	            has_zeros: false,
	            legend_id: null,
	            do_log_plot: true,
	            k_p: null,
	            plot: null
	        };
	    },
	
	    getInitialState: function getInitialState() {
	        return {
	            model_name: this.props.name,
	            omegas: this.props.omegas,
	            settings: this.props.settings
	        };
	    },
	
	    setEvents: function setEvents() {
	        var self = this;
	
	        d3.select("#" + this.save_svg_id).on('click', function (e) {
	            datamonkey.save_image("svg", "#" + self.svg_id);
	        });
	
	        d3.select("#" + this.save_png_id).on('click', function (e) {
	            datamonkey.save_image("png", "#" + self.svg_id);
	        });
	    },
	
	    initialize: function initialize() {
	
	        // clear svg
	        d3.select("#prop-chart").html("");
	
	        this.data_to_plot = this.state.omegas;
	
	        // Set props from settings
	        this.props.svg_id = this.props.settings.svg_id;
	        this.props.dimensions = this.props.settings.dimensions || this.props.dimensions;
	        this.props.margins = this.props.settings.margins || this.props.margins;
	        this.props.legend_id = this.props.settings.legend || this.props.legend_id;
	        this.props.do_log_plot = this.props.settings.log || this.props.do_log_plot;
	        this.props.k_p = this.props.settings.k || this.props.k_p;
	
	        var dimensions = this.props.dimensions;
	        var margins = this.props.margins;
	        console.log(margins);
	
	        if (this.props.do_log_plot) {
	            this.props.has_zeros = this.data_to_plot.some(function (d) {
	                return d.omega <= 0;
	            });
	        }
	
	        this.plot_width = dimensions["width"] - margins['left'] - margins['right'], this.plot_height = dimensions["height"] - margins['top'] - margins['bottom'];
	
	        var domain = this.state.settings["domain"];
	
	        this.omega_scale = (this.props.settings.do_log_plot ? this.props.settings.has_zeros ? d3.scale.pow().exponent(0.2) : d3.scale.log() : d3.scale.linear()).range([0, this.plot_width]).domain(domain).nice();
	
	        this.proportion_scale = d3.scale.linear().range([this.plot_height, 0]).domain([-0.05, 1]).clamp(true);
	
	        // compute margins -- circle AREA is proportional to the relative weight
	        // maximum diameter is (height - text margin)
	        this.svg = d3.select("#" + this.props.settings.svg_id).attr("width", dimensions.width + margins['left'] + margins['right']).attr("height", dimensions.height + margins['top'] + margins['bottom']);
	
	        this.plot = this.svg.selectAll(".container");
	
	        this.svg.selectAll("defs").remove();
	
	        this.svg.append("defs").append("marker").attr("id", "arrowhead").attr("refX", 10) /*must be smarter way to calculate shift*/
	        .attr("refY", 4).attr("markerWidth", 10).attr("markerHeight", 8).attr("orient", "auto").attr("stroke", "#000").attr("fill", "#000").append("path").attr("d", "M 0,0 V8 L10,4 Z");
	
	        if (this.plot.empty()) {
	            this.plot = this.svg.append("g").attr("class", "container");
	        }
	
	        this.plot.attr("transform", "translate(" + this.props.margins["left"] + " , " + this.props.margins["top"] + ")");
	        this.reference_omega_lines = this.plot.selectAll(".hyphy-omega-line-reference"), this.displacement_lines = this.plot.selectAll(".hyphy-displacement-line");
	
	        this.createNeutralLine();
	        this.createXAxis();
	        this.createYAxis();
	        this.setEvents();
	        this.createOmegaLine(this.state.omegas);
	        //_.map(this.props.omegas, function(d) { return this.createOmegaLine(d["omega"],d["prop"]); });
	
	    },
	
	    createOmegaLine: function createOmegaLine(omegas) {
	
	        var data_to_plot = this.data_to_plot;
	        var self = this;
	
	        // generate color wheel from omegas
	        var colores_g = _.shuffle(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]);
	
	        // ** Omega Line (Red) ** //
	        var omega_lines = this.plot.selectAll(".hyphy-omega-line").data(omegas);
	        omega_lines.enter().append("line");
	        omega_lines.exit().remove();
	
	        omega_lines.transition().attr("x1", function (d) {
	            return self.omega_scale(d.omega);
	        }).attr("x2", function (d) {
	            return self.omega_scale(d.omega);
	        }).attr("y1", function (d) {
	            return self.proportion_scale(-0.05);
	        }).attr("y2", function (d) {
	            return self.proportion_scale(d.prop);
	        }).style("stroke", function (d) {
	            color = _.take(colores_g);
	            colores_g = _.rest(colores_g);
	            return color;
	        }).attr("class", "hyphy-omega-line");
	    },
	
	    createNeutralLine: function createNeutralLine() {
	        var self = this;
	
	        // ** Neutral Line (Blue) ** //
	        var neutral_line = this.plot.selectAll(".hyphy-neutral-line").data([1]);
	        neutral_line.enter().append("line").attr("class", "hyphy-neutral-line");
	        neutral_line.exit().remove();
	        neutral_line.transition().attr("x1", function (d) {
	            return self.omega_scale(d);
	        }).attr("x2", function (d) {
	            return self.omega_scale(d);
	        }).attr("y1", 0).attr("y2", this.plot_height);
	    },
	    createXAxis: function createXAxis() {
	
	        // *** X-AXIS *** //
	        var xAxis = d3.svg.axis().scale(this.omega_scale).orient("bottom");
	
	        if (this.props.do_log_plot) {
	            xAxis.ticks(10, this.props.has_zeros ? ".2r" : ".1r");
	        }
	
	        var x_axis = this.svg.selectAll(".x.axis");
	        var x_label;
	
	        if (x_axis.empty()) {
	            x_axis = this.svg.append("g").attr("class", "x hyphy-axis");
	
	            x_label = x_axis.append("g").attr("class", "hyphy-axis-label x-label");
	        } else {
	            x_label = x_axis.select(".axis-label.x-label");
	        }
	
	        x_axis.attr("transform", "translate(" + this.props.margins["left"] + "," + (this.plot_height + this.props.margins["top"]) + ")").call(xAxis);
	        x_label = x_label.attr("transform", "translate(" + this.plot_width + "," + this.props.margins["bottom"] + ")").selectAll("text").data(['\u03C9']);
	        x_label.enter().append("text");
	        x_label.text(function (d) {
	            return d;
	        }).style("text-anchor", "end").attr("dy", "0.0em");
	    },
	    createYAxis: function createYAxis() {
	
	        // *** Y-AXIS *** //
	        var yAxis = d3.svg.axis().scale(this.proportion_scale).orient("left").ticks(10, ".1p");
	
	        var y_axis = this.svg.selectAll(".y.hyphy-axis");
	        var y_label;
	
	        if (y_axis.empty()) {
	            y_axis = this.svg.append("g").attr("class", "y hyphy-axis");
	            y_label = y_axis.append("g").attr("class", "hyphy-axis-label y-label");
	        } else {
	            y_label = y_axis.select(".hyphy-axis-label.y-label");
	        }
	        y_axis.attr("transform", "translate(" + this.props.margins["left"] + "," + this.props.margins["top"] + ")").call(yAxis);
	        y_label = y_label.attr("transform", "translate(" + -this.props.margins["left"] + "," + 0 + ")").selectAll("text").data(["Proportion of sites"]);
	        y_label.enter().append("text");
	        y_label.text(function (d) {
	            return d;
	        }).style("text-anchor", "start").attr("dy", "-1em");
	    },
	
	    componentDidMount: function componentDidMount() {
	        try {
	            this.initialize();
	        } catch (e) {};
	    },
	
	    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	
	        this.setState({
	            model_name: nextProps.name,
	            omegas: nextProps.omegas
	        });
	    },
	
	    componentDidUpdate: function componentDidUpdate() {
	
	        try {
	            this.initialize();
	        } catch (e) {};
	    },
	
	    render: function render() {
	
	        this.svg_id = this.props.settings.svg_id;
	        this.save_svg_id = "export-" + this.svg_id + "-svg";
	        this.save_png_id = "export-" + this.svg_id + "-png";
	
	        return React.createElement(
	            'div',
	            { className: 'panel panel-default', id: this.state.model_name },
	            React.createElement(
	                'div',
	                { className: 'panel-heading' },
	                React.createElement(
	                    'h3',
	                    { className: 'panel-title' },
	                    React.createElement(
	                        'strong',
	                        null,
	                        this.state.model_name
	                    )
	                ),
	                React.createElement(
	                    'p',
	                    null,
	                    '\u03C9 distribution'
	                ),
	                React.createElement(
	                    'div',
	                    { className: 'btn-group' },
	                    React.createElement(
	                        'button',
	                        { id: this.save_svg_id, type: 'button', className: 'btn btn-default btn-sm' },
	                        React.createElement('span', { className: 'glyphicon glyphicon-floppy-save' }),
	                        ' SVG'
	                    ),
	                    React.createElement(
	                        'button',
	                        { id: this.save_png_id, type: 'button', className: 'btn btn-default btn-sm' },
	                        React.createElement('span', { className: 'glyphicon glyphicon-floppy-save' }),
	                        ' PNG'
	                    )
	                )
	            ),
	            React.createElement(
	                'div',
	                { className: 'panel-body' },
	                React.createElement('svg', { id: this.svg_id })
	            )
	        );
	    }
	});
	
	function render_prop_chart(model_name, omegas, settings) {
	    return React.render(React.createElement(PropChart, { name: model_name, omegas: omegas, settings: settings }), document.getElementById("primary-omega-tag"));
	}
	
	function rerender_prop_chart(model_name, omeags, settings) {
	
	    $("#primary-omega-tag").empty();
	    return render_prop_chart(model_name, omeags, settings);
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(54), __webpack_require__(57), __webpack_require__(15)))

/***/ },

/***/ 223:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3, _, $) {"use strict";
	
	__webpack_require__(224);
	__webpack_require__(225);
	
	var React = __webpack_require__(61),
	    ReactDOM = __webpack_require__(227);
	
	var TreeSummary = __webpack_require__(219),
	    PropChart = __webpack_require__(222),
	    ModelFits = __webpack_require__(218),
	    Tree = __webpack_require__(220);
	
	var datamonkey = __webpack_require__(53),
	    busted = __webpack_require__(228);
	
	var BUSTED = React.createClass({
	  displayName: "BUSTED",
	
	
	  float_format: d3.format(".2f"),
	  p_value_format: d3.format(".4f"),
	  fit_format: d3.format(".2f"),
	
	  loadFromServer: function loadFromServer() {
	
	    var self = this;
	
	    d3.json(this.props.url, function (data) {
	
	      data["fits"]["Unconstrained model"]["branch-annotations"] = self.formatBranchAnnotations(data, "Unconstrained model");
	      data["fits"]["Constrained model"]["branch-annotations"] = self.formatBranchAnnotations(data, "Constrained model");
	
	      // rename rate distributions
	      data["fits"]["Unconstrained model"]["rate-distributions"] = data["fits"]["Unconstrained model"]["rate distributions"];
	      data["fits"]["Constrained model"]["rate-distributions"] = data["fits"]["Constrained model"]["rate distributions"];
	
	      // set display order
	      data["fits"]["Unconstrained model"]["display-order"] = 0;
	      data["fits"]["Constrained model"]["display-order"] = 1;
	
	      var json = data,
	          pmid = "25701167",
	          pmid_text = "PubMed ID " + pmid,
	          pmid_href = "http://www.ncbi.nlm.nih.gov/pubmed/" + pmid,
	          p = json["test results"]["p"],
	          test_result = p <= 0.05 ? "evidence" : "no evidence";
	
	      var fg_rate = json["fits"]["Unconstrained model"]["rate distributions"]["FG"];
	      var mapped_omegas = { "omegas": _.map(fg_rate, function (d) {
	          return _.object(["omega", "prop"], d);
	        }) };
	
	      self.setState({
	        p: p,
	        test_result: test_result,
	        json: json,
	        omegas: mapped_omegas["omegas"],
	        pmid_text: pmid_text,
	        pmid_href: pmid_href
	      });
	    });
	  },
	
	  getDefaultProps: function getDefaultProps() {
	
	    var edgeColorizer = function edgeColorizer(element, data) {
	
	      var is_foreground = data.target.annotations.is_foreground,
	          color_fill = this.options()["color-fill"] ? "black" : "red";
	
	      element.style('stroke', is_foreground ? color_fill : 'gray').style('stroke-linejoin', 'round').style('stroke-linejoin', 'round').style('stroke-linecap', 'round');
	    };
	
	    var tree_settings = {
	      'omegaPlot': {},
	      'tree-options': {
	        /* value arrays have the following meaning
	            [0] - the value of the attribute
	            [1] - does the change in attribute value trigger tree re-layout?
	        */
	        'hyphy-tree-model': ["Unconstrained model", true],
	        'hyphy-tree-highlight': ["RELAX.test", false],
	        'hyphy-tree-branch-lengths': [true, true],
	        'hyphy-tree-hide-legend': [true, false],
	        'hyphy-tree-fill-color': [true, false]
	      },
	      'hyphy-tree-legend-type': 'discrete',
	      'suppress-tree-render': false,
	      'chart-append-html': true,
	      'edgeColorizer': edgeColorizer
	    };
	
	    var distro_settings = {
	      dimensions: { width: 600, height: 400 },
	      margins: { 'left': 50, 'right': 15, 'bottom': 35, 'top': 35 },
	      legend: false,
	      domain: [0.00001, 100],
	      do_log_plot: true,
	      k_p: null,
	      plot: null,
	      svg_id: "prop-chart"
	    };
	
	    return {
	      distro_settings: distro_settings,
	      tree_settings: tree_settings,
	      constrained_threshold: "Infinity",
	      null_threshold: "-Infinity",
	      model_name: "FG"
	    };
	  },
	
	  getInitialState: function getInitialState() {
	    return {
	      p: null,
	      test_result: null,
	      json: null,
	      omegas: null,
	      pmid_text: null,
	      pmid_href: null
	    };
	  },
	
	  setEvents: function setEvents() {
	
	    var self = this;
	
	    $("#json_file").on("change", function (e) {
	      var files = e.target.files; // FileList object
	      if (files.length == 1) {
	        var f = files[0];
	        var reader = new FileReader();
	        reader.onload = function (theFile) {
	          return function (e) {
	
	            var data = JSON.parse(this.result);
	            data["fits"]["Unconstrained model"]["branch-annotations"] = self.formatBranchAnnotations(data, "Unconstrained model");
	            data["fits"]["Constrained model"]["branch-annotations"] = self.formatBranchAnnotations(data, "Constrained model");
	
	            // rename rate distributions
	            data["fits"]["Unconstrained model"]["rate-distributions"] = data["fits"]["Unconstrained model"]["rate distributions"];
	            data["fits"]["Constrained model"]["rate-distributions"] = data["fits"]["Constrained model"]["rate distributions"];
	
	            var json = data,
	                pmid = "25701167",
	                pmid_text = "PubMed ID " + pmid,
	                pmid_href = "http://www.ncbi.nlm.nih.gov/pubmed/" + pmid,
	                p = json["test results"]["p"],
	                test_result = p <= 0.05 ? "evidence" : "no evidence";
	
	            var fg_rate = json["fits"]["Unconstrained model"]["rate distributions"]["FG"];
	            var mapped_omegas = { "omegas": _.map(fg_rate, function (d) {
	                return _.object(["omega", "prop"], d);
	              }) };
	
	            self.setState({
	              p: p,
	              test_result: test_result,
	              json: json,
	              omegas: mapped_omegas["omegas"],
	              pmid_text: pmid_text,
	              pmid_href: pmid_href
	            });
	          };
	        }(f);
	        reader.readAsText(f);
	      }
	      $("#datamonkey-absrel-toggle-here").dropdown("toggle");
	      e.preventDefault();
	    });
	  },
	
	  formatBranchAnnotations: function formatBranchAnnotations(json, key) {
	
	    // attach is_foreground to branch annotations
	    var foreground = json["test set"].split(",");
	
	    var tree = d3.layout.phylotree(),
	        nodes = tree(json["fits"][key]["tree string"]).get_nodes(),
	        node_names = _.map(nodes, function (d) {
	      return d.name;
	    });
	
	    // Iterate over objects
	    var branch_annotations = _.object(node_names, _.map(node_names, function (d) {
	      return { is_foreground: _.indexOf(foreground, d) > -1 };
	    }));
	
	    return branch_annotations;
	  },
	
	  initialize: function initialize() {
	
	    var json = this.state.json;
	
	    if (!json) {
	      return;
	    }
	
	    busted.render_histogram("#chart-id", json);
	
	    // delete existing tree
	    d3.select('#tree_container').select("svg").remove();
	
	    var fg_rate = json["fits"]["Unconstrained model"]["rate distributions"]["FG"],
	        omegas = fg_rate.map(function (r) {
	      return r[0];
	    }),
	        weights = fg_rate.map(function (r) {
	      return r[1];
	    });
	
	    var dsettings = {
	      'log': true,
	      'legend': false,
	      'domain': [0.00001, 20],
	      'dimensions': { 'width': 325, 'height': 300 }
	    };
	
	    $("#export-dist-svg").on('click', function (e) {
	      datamonkey.save_image("svg", "#primary-omega-dist");
	    });
	
	    $("#export-dist-png").on('click', function (e) {
	      datamonkey.save_image("png", "#primary-omega-dist");
	    });
	  },
	
	  componentWillMount: function componentWillMount() {
	    this.loadFromServer();
	    this.setEvents();
	  },
	
	  render: function render() {
	
	    var self = this;
	    self.initialize();
	
	    return React.createElement(
	      "div",
	      { className: "tab-content" },
	      React.createElement(
	        "div",
	        { className: "tab-pane active", id: "summary_tab" },
	        React.createElement(
	          "div",
	          { className: "row", styleName: "margin-top: 5px" },
	          React.createElement(
	            "div",
	            { className: "col-md-12" },
	            React.createElement(
	              "ul",
	              { className: "list-group" },
	              React.createElement(
	                "li",
	                { className: "list-group-item list-group-item-info" },
	                React.createElement(
	                  "h3",
	                  { className: "list-group-item-heading" },
	                  React.createElement("i", { className: "fa fa-list", styleName: "margin-right: 10px" }),
	                  React.createElement(
	                    "span",
	                    { id: "summary-method-name" },
	                    "BUSTED"
	                  ),
	                  " summary"
	                ),
	                "There is ",
	                React.createElement(
	                  "strong",
	                  null,
	                  this.state.test_result
	                ),
	                " of episodic diversifying selection, with LRT p-value of ",
	                this.state.p,
	                ".",
	                React.createElement(
	                  "p",
	                  null,
	                  React.createElement(
	                    "small",
	                    null,
	                    "Please cite ",
	                    React.createElement(
	                      "a",
	                      { href: this.state.pmid_href, id: "summary-pmid" },
	                      this.state.pmid_text
	                    ),
	                    " if you use this result in a publication, presentation, or other scientific work."
	                  )
	                )
	              )
	            )
	          )
	        ),
	        React.createElement(
	          "div",
	          { className: "row" },
	          React.createElement(
	            "div",
	            { id: "hyphy-model-fits", className: "col-lg-12" },
	            React.createElement(ModelFits, { json: self.state.json })
	          )
	        ),
	        React.createElement(
	          "button",
	          { id: "export-chart-svg", type: "button", className: "btn btn-default btn-sm pull-right btn-export" },
	          React.createElement("span", { className: "glyphicon glyphicon-floppy-save" }),
	          " Export Chart to SVG"
	        ),
	        React.createElement(
	          "button",
	          { id: "export-chart-png", type: "button", className: "btn btn-default btn-sm pull-right btn-export" },
	          React.createElement("span", { className: "glyphicon glyphicon-floppy-save" }),
	          " Export Chart to PNG"
	        ),
	        React.createElement(
	          "div",
	          { className: "row hyphy-busted-site-table" },
	          React.createElement(
	            "div",
	            { id: "chart-id", className: "col-lg-8" },
	            React.createElement(
	              "strong",
	              null,
	              "Model Evidence Ratios Per Site"
	            ),
	            React.createElement("div", { className: "clearfix" })
	          )
	        ),
	        React.createElement(
	          "div",
	          { className: "row site-table" },
	          React.createElement(
	            "div",
	            { className: "col-lg-12" },
	            React.createElement(
	              "form",
	              { id: "er-thresholds" },
	              React.createElement(
	                "div",
	                { className: "form-group" },
	                React.createElement(
	                  "label",
	                  { "for": "er-constrained-threshold" },
	                  "Constrained Evidence Ratio Threshold:"
	                ),
	                React.createElement("input", { type: "text", className: "form-control", id: "er-constrained-threshold", defaultValue: this.props.constrained_threshold })
	              ),
	              React.createElement(
	                "div",
	                { className: "form-group" },
	                React.createElement(
	                  "label",
	                  { "for": "er-optimized-null-threshold" },
	                  "Optimized Null Evidence Ratio Threshold:"
	                ),
	                React.createElement("input", { type: "text", className: "form-control", id: "er-optimized-null-threshold", defaultValue: this.props.null_threshold })
	              )
	            ),
	            React.createElement(
	              "button",
	              { id: "export-csv", type: "button", className: "btn btn-default btn-sm pull-right hyphy-busted-btn-export" },
	              React.createElement("span", { className: "glyphicon glyphicon-floppy-save" }),
	              " Export Table to CSV"
	            ),
	            React.createElement(
	              "button",
	              { id: "apply-thresholds", type: "button", className: "btn btn-default btn-sm pull-right hyphy-busted-btn-export" },
	              "Apply Thresholds"
	            ),
	            React.createElement(
	              "table",
	              { id: "sites", className: "table sites dc-data-table" },
	              React.createElement(
	                "thead",
	                null,
	                React.createElement(
	                  "tr",
	                  { className: "header" },
	                  React.createElement(
	                    "th",
	                    null,
	                    "Site Index"
	                  ),
	                  React.createElement(
	                    "th",
	                    null,
	                    "Unconstrained Likelihood"
	                  ),
	                  React.createElement(
	                    "th",
	                    null,
	                    "Constrained Likelihood"
	                  ),
	                  React.createElement(
	                    "th",
	                    null,
	                    "Optimized Null Likelihood"
	                  ),
	                  React.createElement(
	                    "th",
	                    null,
	                    "Constrained Evidence Ratio"
	                  ),
	                  React.createElement(
	                    "th",
	                    null,
	                    "Optimized Null Evidence Ratio"
	                  )
	                )
	              )
	            )
	          )
	        )
	      ),
	      React.createElement(
	        "div",
	        { className: "tab-pane", id: "tree_tab" },
	        React.createElement(
	          "div",
	          { className: "col-md-12" },
	          React.createElement(Tree, { json: self.state.json,
	            settings: self.props.tree_settings })
	        ),
	        React.createElement(
	          "div",
	          { className: "col-md-12" },
	          React.createElement(
	            "div",
	            { id: "primary-omega-dist", className: "panel-body" },
	            React.createElement(PropChart, { name: self.props.model_name, omegas: self.state.omegas,
	              settings: self.props.distro_settings })
	          )
	        )
	      )
	    );
	  }
	});
	
	// Will need to make a call to this
	// omega distributions
	var render_busted = function render_busted(url, element) {
	  ReactDOM.render(React.createElement(BUSTED, { url: url }), document.getElementById(element));
	};
	
	module.exports = render_busted;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(54), __webpack_require__(57), __webpack_require__(15)))

/***/ },

/***/ 225:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 227:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(63);


/***/ },

/***/ 228:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3, $) {'use strict';
	
	__webpack_require__(229);
	
	var crossfilter = __webpack_require__(231),
	    dc = __webpack_require__(234),
	    datamonkey = __webpack_require__(53);
	
	function busted_render_summary(json) {
	
	    var fit_format = d3.format(".2f"),
	        prop_format = d3.format(".2p"),
	        omega_format = d3.format(".3r");
	
	    var format_run_time = function format_run_time(seconds) {
	
	        var duration_string = "";
	        seconds = parseFloat(seconds);
	        var split_array = [Math.floor(seconds / (24 * 3600)), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60],
	            quals = ["d.", "hrs.", "min.", "sec."];
	
	        split_array.forEach(function (d, i) {
	            if (d) {
	                duration_string += " " + d + " " + quals[i];
	            }
	        });
	
	        return duration_string;
	    };
	
	    var branch_p_values = {};
	
	    var rate_distro_by_branch = {},
	        branch_count = 1,
	        selected_count = 0,
	        tested_count = 0;
	
	    var for_branch_table = [];
	
	    //var tree_info = render_bs_rel_tree (json, "Unconstrained model");
	
	    //var branch_lengths   = tree_info[0],
	    //    tested_branches  = {};
	
	    for (var p in json["test results"]) {
	        branch_p_values[p] = json["test results"]["p"];
	        if (branch_p_values[p] <= 0.05) {
	            selected_count++;
	        }
	    }
	
	    var fitted_distributions = json["fits"]["Unconstrained model"]["rate distributions"];
	
	    for (var b in fitted_distributions) {
	        //for_branch_table.push ([b + (tested_branches[b] ? "" : ""),branch_lengths[b],0,0,0]);
	        try {
	            for_branch_table[branch_count][2] = json["test results"][b]["LRT"];
	            for_branch_table[branch_count][3] = json["test results"][b]["p"];
	            for_branch_table[branch_count][4] = json["test results"][b]["uncorrected p"];
	        } catch (e) {}
	
	        var rateD = fitted_distributions[b];
	        rate_distro_by_branch[b] = rateD;
	        //for_branch_table[branch_count].push (branch_omegas[b]['distro']);
	        branch_count += 1;
	    }
	
	    // render summary data
	    var total_tree_length = d3.format("g")(json["fits"]["Unconstrained model"]["tree length"]);
	
	    for_branch_table = for_branch_table.sort(function (a, b) {
	        return a[4] - b[4];
	    });
	
	    d3.select('#summary-test-result').text(json['test results']['p'] <= 0.05 ? "evidence" : "no evidence");
	    d3.select('#summary-test-pvalue').text(d3.format(".3f")(json['test results']['p']));
	    d3.select('#summary-pmid').text("PubMed ID " + json['PMID']).attr("href", "http://www.ncbi.nlm.nih.gov/pubmed/" + json['PMID']);
	    d3.select('#summary-total-runtime').text(format_run_time(json['timers']['overall']));
	    d3.select('#summary-total-branches').text(branch_count);
	    d3.select('#summary-tested-branches').text(tested_count);
	    d3.select('#summary-selected-branches').text(selected_count);
	
	    has_background = json['background'];
	
	    var model_rows = [[], []];
	
	    if (has_background) {
	        model_rows.push([]);
	    }
	
	    for (k = 0; k < 2 + has_background; k++) {
	
	        var access_key,
	            secondary_key,
	            only_distro = 0;
	
	        if (k === 0) {
	
	            access_key = 'Unconstrained model';
	            secondary_key = 'FG';
	            model_rows[k].push('Unconstrained Model');
	            only_distro = 0;
	        } else {
	
	            if (has_background && k == 1) {
	                model_rows[k].push('(background branches)');
	                secondary_key = 'BG';
	                only_distro = 1;
	            } else {
	                access_key = 'Constrained model';
	                if (!(access_key in json['fits'])) {
	                    break;
	                }
	                model_rows[k].push('Constrained Model');
	                secondary_key = 'FG';
	                only_distro = 0;
	            }
	        }
	
	        try {
	            model_rows[k].push(only_distro ? '' : fit_format(json['fits'][access_key]['log-likelihood']));
	            model_rows[k].push(only_distro ? '' : json['fits'][access_key]['parameters']);
	            model_rows[k].push(only_distro ? '' : fit_format(json['fits'][access_key]['AIC-c']));
	            model_rows[k].push(only_distro ? '' : format_run_time(json['fits'][access_key]['runtime']));
	            model_rows[k].push(only_distro ? '' : fit_format(json['fits'][access_key]['tree length']));
	
	            for (j = 0; j < 3; j++) {
	                model_rows[k].push(omega_format(json['fits'][access_key]['rate distributions'][secondary_key][j][0]) + " (" + prop_format(json['fits'][access_key]['rate distributions'][secondary_key][j][1]) + ")");
	            }
	        } catch (e) {
	            datamonkey.errorModal(e);
	        }
	    }
	
	    model_rows = d3.select('#summary-model-table').selectAll("tr").data(model_rows);
	    model_rows.enter().append('tr');
	    model_rows.exit().remove();
	    model_rows = model_rows.selectAll("td").data(function (d) {
	        return d;
	    });
	    model_rows.enter().append("td");
	    model_rows.html(function (d) {
	        return d;
	    });
	}
	
	function busted_render_histogram(c, json) {
	
	    var self = this;
	
	    // Massage data for use with crossfilter
	    if (d3.keys(json["evidence ratios"]).length === 0) {
	        // no evidence ratios computed
	        d3.selectAll(c).style("display", "none");
	        d3.selectAll(".dc-data-table").style("display", "none");
	        //d3.selectAll ('[id^="export"]').style ("display", "none");
	        d3.selectAll("#er-thresholds").style("display", "none");
	        d3.selectAll("#apply-thresholds").style("display", "none");
	        return;
	    } else {
	        d3.selectAll(c).style("display", "block");
	        d3.selectAll(".dc-data-table").style("display", "table");
	        //d3.selectAll ('[id^="export"]').style ("display", "block");
	        d3.selectAll("#er-thresholds").style("display", "block");
	        d3.selectAll("#apply-thresholds").style("display", "block");
	    }
	
	    var erc = json["evidence ratios"]["constrained"][0];
	    erc = erc.map(function (d) {
	        return Math.log(d);
	    });
	
	    var test_set = json["test set"].split(",");
	    var model_results = [];
	
	    erc.forEach(function (elem, i) {
	        model_results.push({
	            "site_index": i + 1,
	            "unconstrained": json["profiles"]["unconstrained"][0][i],
	            "constrained": json["profiles"]["constrained"][0][i],
	            "optimized_null": json["profiles"]["optimized null"][0][i],
	            "er_constrained": Math.log(json["evidence ratios"]["constrained"][0][i]),
	            "er_optimized_null": Math.log(json["evidence ratios"]["optimized null"][0][i])
	        });
	    });
	
	    var data = crossfilter(model_results);
	    var site_index = data.dimension(function (d) {
	        return d["site_index"];
	    });
	
	    var sitesByConstrained = site_index.group().reduce(function (p, v) {
	        p.constrained_evidence += +v["er_constrained"];
	        p.optimized_null_evidence += +v["er_optimized_null"];
	        return p;
	    }, function (p, v) {
	        p.constrained_evidence -= +v["er_constrained"];
	        p.optimized_null_evidence -= +v["er_optimized_null"];
	        return p;
	    }, function () {
	        return { constrained_evidence: 0, optimized_null_evidence: 0 };
	    });
	
	    var sitesByON = site_index.group().reduce(function (p, v) {
	        p.optimized_null_evidence += +v["er_optimized_null"];
	        return p;
	    }, function (p, v) {
	        p.optimized_null_evidence -= +v["er_optimized_null"];
	        return p;
	    }, function () {
	        return { optimized_null_evidence: 0 };
	    });
	
	    // Set up new crossfilter dimensions to slice the table by constrained or ON evidence ratio.
	    var er_constrained = data.dimension(function (d) {
	        return d["er_constrained"];
	    });
	    var er_optimized_null = data.dimension(function (d) {
	        return d["er_optimized_null"];
	    });
	    self.er_constrained = er_constrained;
	    self.er_optimized_null = er_optimized_null;
	
	    var composite = dc.compositeChart(c);
	
	    composite.width($(window).width()).height(300).dimension(site_index).x(d3.scale.linear().domain([1, erc.length])).yAxisLabel("2 * Ln Evidence Ratio").xAxisLabel("Site Location").legend(dc.legend().x($(window).width() - 150).y(20).itemHeight(13).gap(5)).renderHorizontalGridLines(true).compose([dc.lineChart(composite).group(sitesByConstrained, "Constrained").colors(d3.scale.ordinal().range(['green'])).valueAccessor(function (d) {
	        return 2 * d.value.constrained_evidence;
	    }).keyAccessor(function (d) {
	        return d.key;
	    }), dc.lineChart(composite).group(sitesByON, "Optimized Null").valueAccessor(function (d) {
	        return 2 * d.value.optimized_null_evidence;
	    }).keyAccessor(function (d) {
	        return d.key;
	    }).colors(d3.scale.ordinal().range(['red']))]);
	
	    composite.xAxis().ticks(50);
	
	    var numberFormat = d3.format(".4f");
	
	    // Render the table
	    dc.dataTable(".dc-data-table").dimension(site_index)
	    // data table does not use crossfilter group but rather a closure
	    // as a grouping function
	    .group(function (d) {
	        return site_index.bottom(1)[0].site_index + " - " + site_index.top(1)[0].site_index;
	    }).size(site_index.groupAll().reduceCount().value()) // (optional) max number of records to be shown, :default = 25
	    // dynamic columns creation using an array of closures
	    .columns([function (d) {
	        return d.site_index;
	    }, function (d) {
	        return numberFormat(d["unconstrained"]);
	    }, function (d) {
	        return numberFormat(d["constrained"]);
	    }, function (d) {
	        return numberFormat(d["optimized_null"]);
	    }, function (d) {
	        return numberFormat(d["er_constrained"]);
	    }, function (d) {
	        return numberFormat(d["er_optimized_null"]);
	    }])
	
	    // (optional) sort using the given field, :default = function(d){return d;}
	    .sortBy(function (d) {
	        return d.site_index;
	    })
	
	    // (optional) sort order, :default ascending
	    .order(d3.ascending)
	
	    // (optional) custom renderlet to post-process chart using D3
	    .renderlet(function (table) {
	        table.selectAll(".dc-table-group").classed("info", true);
	    });
	
	    $("#export-csv").on('click', function (e) {
	        datamonkey.export_csv_button(site_index.top(Infinity));
	    });
	
	    $("#export-chart-svg").on('click', function (e) {
	        // class manipulation for the image to display correctly
	        $("#chart-id").find("svg")[0].setAttribute("class", "dc-chart");
	        datamonkey.save_image("svg", "#chart-id");
	        $("#chart-id").find("svg")[0].setAttribute("class", "");
	    });
	
	    $("#export-chart-png").on('click', function (e) {
	        // class manipulation for the image to display correctly
	        $("#chart-id").find("svg")[0].setAttribute("class", "dc-chart");
	        datamonkey.save_image("png", "#chart-id");
	        $("#chart-id").find("svg")[0].setAttribute("class", "");
	    });
	    $("#apply-thresholds").on('click', function (e) {
	        var erConstrainedThreshold = document.getElementById("er-constrained-threshold").value;
	        var erOptimizedNullThreshold = document.getElementById("er-optimized-null-threshold").value;
	        self.er_constrained.filter(function (d) {
	            return d >= erConstrainedThreshold;
	        });
	        self.er_optimized_null.filter(function (d) {
	            return d >= erOptimizedNullThreshold;
	        });
	        dc.renderAll();
	    });
	
	    dc.renderAll();
	}
	
	module.exports.render_summary = busted_render_summary;
	module.exports.render_histogram = busted_render_histogram;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(54), __webpack_require__(15)))

/***/ },

/***/ 229:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 235:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3, $, _) {"use strict";
	
	__webpack_require__(218);
	__webpack_require__(219);
	__webpack_require__(220);
	__webpack_require__(236);
	
	var React = __webpack_require__(61);
	
	var RELAX = React.createClass({
	  displayName: "RELAX",
	
	
	  float_format: d3.format(".2f"),
	  p_value_format: d3.format(".4f"),
	  fit_format: d3.format(".2f"),
	
	  loadFromServer: function loadFromServer() {
	
	    var self = this;
	
	    d3.json(this.props.url, function (data) {
	
	      data["fits"]["Partitioned MG94xREV"]["branch-annotations"] = self.formatBranchAnnotations(data, "Partitioned MG94xREV");
	      data["fits"]["General Descriptive"]["branch-annotations"] = self.formatBranchAnnotations(data, "General Descriptive");
	      data["fits"]["Null"]["branch-annotations"] = self.formatBranchAnnotations(data, "Null");
	      data["fits"]["Alternative"]["branch-annotations"] = self.formatBranchAnnotations(data, "Alternative");
	      data["fits"]["Partitioned Exploratory"]["branch-annotations"] = self.formatBranchAnnotations(data, "Partitioned Exploratory");
	
	      var annotations = data["fits"]["Partitioned MG94xREV"]["branch-annotations"],
	          json = data,
	          pmid = data["PMID"],
	          test_results = data["relaxation_test"];
	
	      var p = data["relaxation-test"]["p"],
	          direction = data["fits"]["Alternative"]["K"] > 1 ? 'intensification' : 'relaxation',
	          evidence = p <= self.props.alpha_level ? 'significant' : 'not significant',
	          pvalue = self.p_value_format(p),
	          lrt = self.fit_format(data["relaxation-test"]["LR"]),
	          summary_k = self.fit_format(data["fits"]["Alternative"]["K"]),
	          pmid_text = "PubMed ID " + pmid,
	          pmid_href = "http://www.ncbi.nlm.nih.gov/pubmed/" + pmid;
	
	      self.setState({
	        annotations: annotations,
	        json: json,
	        pmid: pmid,
	        test_results: test_results,
	        p: p,
	        direction: direction,
	        evidence: evidence,
	        pvalue: pvalue,
	        lrt: lrt,
	        summary_k: summary_k,
	        pmid_text: pmid_text,
	        pmid_href: pmid_href
	      });
	    });
	  },
	
	  getDefaultProps: function getDefaultProps() {
	
	    var edgeColorizer = function edgeColorizer(element, data) {
	
	      var self = this,
	          scaling_exponent = 0.33,
	          omega_format = d3.format(".3r");
	
	      var omega_color = d3.scale.pow().exponent(scaling_exponent).domain([0, 0.25, 1, 5, 10]).range(self.options()["color-fill"] ? ["#DDDDDD", "#AAAAAA", "#888888", "#444444", "#000000"] : ["#6e4fa2", "#3288bd", "#e6f598", "#f46d43", "#9e0142"]).clamp(true);
	
	      if (data.target.annotations) {
	        element.style('stroke', omega_color(data.target.annotations.length) || null);
	        $(element[0][0]).tooltip('destroy');
	        $(element[0][0]).tooltip({
	          'title': omega_format(data.target.annotations.length),
	          'html': true,
	          'trigger': 'hover',
	          'container': 'body',
	          'placement': 'auto'
	        });
	      } else {
	        element.style('stroke', null);
	        $(element[0][0]).tooltip('destroy');
	      }
	
	      var selected_partition = $("#hyphy-tree-highlight").attr("value");
	
	      if (selected_partition && this.get_partitions()) {
	        var partitions = this.get_partitions()[selected_partition];
	
	        element.style('stroke-width', partitions && partitions[data.target.name] ? '8' : '4').style('stroke-linejoin', 'round').style('stroke-linecap', 'round');
	      }
	    };
	
	    return {
	      edgeColorizer: edgeColorizer,
	      alpha_level: 0.05
	    };
	  },
	
	  getInitialState: function getInitialState() {
	
	    var model_fits_id = "#hyphy-model-fits",
	        omega_plots_id = "#hyphy-omega-plots",
	        summary_id = "#hyphy-relax-summary",
	        tree_id = "#tree-tab";
	
	    var tree_settings = {
	      'omegaPlot': {},
	      'tree-options': {
	        /* value arrays have the following meaning
	            [0] - the value of the attribute
	            [1] - does the change in attribute value trigger tree re-layout?
	        */
	        'hyphy-tree-model': ["Partitioned MG94xREV", true],
	        'hyphy-tree-highlight': ["RELAX.test", false],
	        'hyphy-tree-branch-lengths': [true, true],
	        'hyphy-tree-hide-legend': [true, false],
	        'hyphy-tree-fill-color': [true, false]
	      },
	      'suppress-tree-render': false,
	      'chart-append-html': true,
	      'edgeColorizer': this.props.edgeColorizer
	    };
	
	    return {
	      annotations: null,
	      json: null,
	      pmid: null,
	      settings: tree_settings,
	      test_results: null,
	      tree: null,
	      p: null,
	      direction: 'unknown',
	      evidence: 'unknown',
	      pvalue: null,
	      lrt: null,
	      summary_k: 'unknown',
	      pmid_text: "PubMed ID : Unknown",
	      pmid_href: "#",
	      relaxation_K: "unknown"
	    };
	  },
	
	  componentWillMount: function componentWillMount() {
	    this.loadFromServer();
	    this.setEvents();
	  },
	
	  setEvents: function setEvents() {
	
	    var self = this;
	
	    $("#datamonkey-relax-load-json").on("change", function (e) {
	      var files = e.target.files; // FileList object
	
	      if (files.length == 1) {
	        var f = files[0];
	        var reader = new FileReader();
	
	        reader.onload = function (theFile) {
	          return function (e) {
	
	            var data = JSON.parse(this.result);
	            data["fits"]["Partitioned MG94xREV"]["branch-annotations"] = self.formatBranchAnnotations(data, "Partitioned MG94xREV");
	            data["fits"]["General Descriptive"]["branch-annotations"] = self.formatBranchAnnotations(data, "General Descriptive");
	            data["fits"]["Null"]["branch-annotations"] = self.formatBranchAnnotations(data, "Null");
	            data["fits"]["Alternative"]["branch-annotations"] = self.formatBranchAnnotations(data, "Alternative");
	            data["fits"]["Partitioned Exploratory"]["branch-annotations"] = self.formatBranchAnnotations(data, "Partitioned Exploratory");
	
	            var annotations = data["fits"]["Partitioned MG94xREV"]["branch-annotations"],
	                json = data,
	                pmid = data["PMID"],
	                test_results = data["relaxation_test"];
	
	            var p = data["relaxation-test"]["p"],
	                direction = data["fits"]["Alternative"]["K"] > 1 ? 'intensification' : 'relaxation',
	                evidence = p <= self.props.alpha_level ? 'significant' : 'not significant',
	                pvalue = self.p_value_format(p),
	                lrt = self.fit_format(data["relaxation-test"]["LR"]),
	                summary_k = self.fit_format(data["fits"]["Alternative"]["K"]),
	                pmid_text = "PubMed ID " + pmid,
	                pmid_href = "http://www.ncbi.nlm.nih.gov/pubmed/" + pmid;
	
	            self.setState({
	              annotations: annotations,
	              json: json,
	              pmid: pmid,
	              test_results: test_results,
	              p: p,
	              direction: direction,
	              evidence: evidence,
	              pvalue: pvalue,
	              lrt: lrt,
	              summary_k: summary_k,
	              pmid_text: pmid_text,
	              pmid_href: pmid_href
	            });
	          };
	        }(f);
	        reader.readAsText(f);
	      }
	
	      $("#datamonkey-absrel-toggle-here").dropdown("toggle");
	      e.preventDefault();
	    });
	  },
	
	  formatBranchAnnotations: function formatBranchAnnotations(json, key) {
	
	    var initial_branch_annotations = json["fits"][key]["branch-annotations"];
	
	    if (!initial_branch_annotations) {
	      initial_branch_annotations = json["fits"][key]["rate distributions"];
	    }
	
	    // Iterate over objects
	    branch_annotations = _.mapObject(initial_branch_annotations, function (val, key) {
	      return { "length": val };
	    });
	
	    return branch_annotations;
	  },
	
	  initialize: function initialize() {},
	
	  render: function render() {
	
	    var self = this;
	
	    return React.createElement(
	      "div",
	      { className: "tab-content" },
	      React.createElement(
	        "div",
	        { className: "tab-pane active", id: "datamonkey-relax-summary-tab" },
	        React.createElement(
	          "div",
	          { id: "hyphy-relax-summary", className: "row" },
	          React.createElement(
	            "div",
	            { className: "col-md-12" },
	            React.createElement(
	              "ul",
	              { className: "list-group" },
	              React.createElement(
	                "li",
	                { className: "list-group-item list-group-item-info" },
	                React.createElement(
	                  "h3",
	                  { className: "list-group-item-heading" },
	                  React.createElement("i", { className: "fa fa-list", styleFormat: "margin-right: 10px" }),
	                  React.createElement(
	                    "span",
	                    { id: "summary-method-name" },
	                    "RELAX(ed selection test)"
	                  ),
	                  " summary"
	                ),
	                React.createElement(
	                  "p",
	                  { className: "list-group-item-text lead", styleFormat: "margin-top:0.5em; " },
	                  "Test for selection ",
	                  React.createElement(
	                    "strong",
	                    { id: "summary-direction" },
	                    this.state.direction
	                  ),
	                  "(",
	                  React.createElement(
	                    "abbr",
	                    { title: "Relaxation coefficient" },
	                    "K"
	                  ),
	                  " = ",
	                  React.createElement(
	                    "strong",
	                    { id: "summary-K" },
	                    this.state.summary_k
	                  ),
	                  ") was ",
	                  React.createElement(
	                    "strong",
	                    { id: "summary-evidence" },
	                    this.state.evidence
	                  ),
	                  "(p = ",
	                  React.createElement(
	                    "strong",
	                    { id: "summary-pvalue" },
	                    this.state.p
	                  ),
	                  ", ",
	                  React.createElement(
	                    "abbr",
	                    { title: "Likelihood ratio statistic" },
	                    "LR"
	                  ),
	                  " = ",
	                  React.createElement(
	                    "strong",
	                    { id: "summary-LRT" },
	                    this.state.lrt
	                  ),
	                  ")"
	                ),
	                React.createElement(
	                  "p",
	                  null,
	                  React.createElement(
	                    "small",
	                    null,
	                    "Please cite ",
	                    React.createElement(
	                      "a",
	                      { href: this.state.pmid_href, id: "summary-pmid" },
	                      this.state.pmid_text
	                    ),
	                    " if you use this result in a publication, presentation, or other scientific work."
	                  )
	                )
	              )
	            )
	          )
	        ),
	        React.createElement(
	          "div",
	          { id: "hyphy-model-fits", className: "row" },
	          React.createElement(ModelFits, { json: self.state.json })
	        ),
	        React.createElement(
	          "div",
	          { id: "hyphy-omega-plots", className: "row" },
	          React.createElement(OmegaPlotGrid, { json: self.state.json })
	        )
	      ),
	      React.createElement(
	        "div",
	        { className: "tab-pane", id: "tree-tab" },
	        React.createElement(Tree, { json: self.state.json,
	          settings: self.state.settings })
	      )
	    );
	  }
	});
	
	// Will need to make a call to this
	// omega distributions
	function render_relax(url, element) {
	  React.render(React.createElement(RELAX, { url: url }), document.getElementById(element));
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(54), __webpack_require__(15), __webpack_require__(57)))

/***/ },

/***/ 236:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3, _) {'use strict';
	
	var React = __webpack_require__(61);
	var datamonkey = __webpack_require__(53);
	
	var OmegaPlot = React.createClass({
	    displayName: 'OmegaPlot',
	
	
	    getDefaultProps: function getDefaultProps() {
	        return {
	            svg_id: null,
	            dimensions: { width: 600, height: 400 },
	            margins: { 'left': 50, 'right': 15, 'bottom': 35, 'top': 35 },
	            has_zeros: false,
	            legend_id: null,
	            do_log_plot: true,
	            k_p: null,
	            plot: null
	        };
	    },
	
	    setEvents: function setEvents() {
	        var self = this;
	
	        d3.select("#" + this.save_svg_id).on('click', function (e) {
	            datamonkey.save_image("svg", "#" + self.svg_id);
	        });
	
	        d3.select("#" + this.save_png_id).on('click', function (e) {
	            datamonkey.save_image("png", "#" + self.svg_id);
	        });
	    },
	
	    initialize: function initialize() {
	
	        if (!this.state.omegas || !this.state.omegas["Reference"]) {
	            return;
	        }
	
	        var data_to_plot = this.state.omegas["Reference"];
	        var secondary_data = this.state.omegas["Test"];
	
	        // Set props from settings
	        this.props.svg_id = this.props.settings.svg_id;
	        this.props.dimensions = this.props.settings.dimensions || this.props.dimensions;
	        this.props.legend_id = this.props.settings.legend || this.props.legend_id;
	        this.props.do_log_plot = this.props.settings.log || this.props.do_log_plot;
	        this.props.k_p = this.props.settings.k || this.props.k_p;
	
	        var dimensions = this.props.dimensions;
	        var margins = this.props.margins;
	
	        if (this.props.do_log_plot) {
	            this.props.has_zeros = data_to_plot.some(function (d) {
	                return d.omega <= 0;
	            });
	            if (secondary_data) {
	                this.props.has_zeros = this.props.has_zeros || data_to_plot.some(function (d) {
	                    return d.omega <= 0;
	                });
	            }
	        }
	
	        this.plot_width = dimensions["width"] - margins['left'] - margins['right'], this.plot_height = dimensions["height"] - margins['top'] - margins['bottom'];
	
	        var domain = this.state.settings["domain"] || d3.extent(secondary_data ? secondary_data.map(function (d) {
	            return d.omega;
	        }).concat(data_to_plot.map(function (d) {
	            return d.omega;
	        })) : data_to_plot.map(function (d) {
	            return d.omega;
	        }));
	
	        domain[0] *= 0.5;
	
	        this.omega_scale = (this.props.do_log_plot ? this.props.has_zeros ? d3.scale.pow().exponent(0.2) : d3.scale.log() : d3.scale.linear()).range([0, this.plot_width]).domain(domain).nice();
	
	        this.proportion_scale = d3.scale.linear().range([this.plot_height, 0]).domain([-0.05, 1]).clamp(true);
	
	        // compute margins -- circle AREA is proportional to the relative weight
	        // maximum diameter is (height - text margin)
	        this.svg = d3.select("#" + this.props.settings.svg_id).attr("width", dimensions.width).attr("height", dimensions.height);
	        this.plot = this.svg.selectAll(".container");
	
	        this.svg.selectAll("defs").remove();
	        this.svg.append("defs").append("marker").attr("id", "arrowhead").attr("refX", 10) /*must be smarter way to calculate shift*/
	        .attr("refY", 4).attr("markerWidth", 10).attr("markerHeight", 8).attr("orient", "auto").attr("stroke", "#000").attr("fill", "#000").append("path").attr("d", "M 0,0 V8 L10,4 Z");
	
	        if (this.plot.empty()) {
	            this.plot = this.svg.append("g").attr("class", "container");
	        }
	
	        this.plot.attr("transform", "translate(" + this.props.margins["left"] + " , " + this.props.margins["top"] + ")");
	        this.reference_omega_lines = this.plot.selectAll(".hyphy-omega-line-reference"), this.displacement_lines = this.plot.selectAll(".hyphy-displacement-line");
	
	        this.createDisplacementLine();
	        this.createNeutralLine();
	        this.createOmegaLine();
	        this.createReferenceLine();
	        this.createXAxis();
	        this.createYAxis();
	        this.setEvents();
	    },
	    makeSpring: function makeSpring(x1, x2, y1, y2, step, displacement) {
	
	        if (x1 == x2) {
	            y1 = Math.min(y1, y2);
	            return "M" + x1 + "," + (y1 - 40) + "v20";
	        }
	
	        var spring_data = [],
	            point = [x1, y1],
	            angle = Math.atan2(y2 - y1, x2 - x1);
	
	        var step = [step * Math.cos(angle), step * Math.sin(angle)];
	        var k = 0;
	
	        if (Math.abs(x1 - x2) < 15) {
	            spring_data.push(point);
	        } else {
	            while (x1 < x2 && point[0] < x2 - 15 || x1 > x2 && point[0] > x2 + 15) {
	                point = point.map(function (d, i) {
	                    return d + step[i];
	                });
	                if (k % 2) {
	                    spring_data.push([point[0], point[1] + displacement]);
	                } else {
	                    spring_data.push([point[0], point[1] - displacement]);
	                }
	                k++;
	                if (k > 100) {
	                    break;
	                }
	            }
	        }
	
	        if (spring_data.length > 1) {
	            spring_data.pop();
	        }
	
	        spring_data.push([x2, y2]);
	        var line = d3.svg.line().interpolate("monotone");
	        return line(spring_data);
	    },
	    createDisplacementLine: function createDisplacementLine() {
	
	        var self = this;
	        var data_to_plot = this.state.omegas["Reference"];
	        var secondary_data = this.state.omegas["Test"];
	
	        if (secondary_data) {
	            var diffs = data_to_plot.map(function (d, i) {
	                return {
	                    'x1': d.omega,
	                    'x2': secondary_data[i].omega,
	                    'y1': d.weight * 0.98,
	                    'y2': secondary_data[i].weight * 0.98
	                };
	            });
	
	            this.displacement_lines = this.displacement_lines.data(diffs);
	            this.displacement_lines.enter().append("path");
	            this.displacement_lines.exit().remove();
	            this.displacement_lines.transition().attr("d", function (d) {
	                return self.makeSpring(self.omega_scale(d.x1), self.omega_scale(d.x2), self.proportion_scale(d.y1 * 0.5), self.proportion_scale(d.y2 * 0.5), 5, 5);
	            }).attr("marker-end", "url(#arrowhead)").attr("class", "hyphy-displacement-line");
	        }
	    },
	    createReferenceLine: function createReferenceLine() {
	
	        var data_to_plot = this.state.omegas["Reference"];
	        var secondary_data = this.state.omegas["Test"];
	        var self = this;
	
	        if (secondary_data) {
	            this.reference_omega_lines = this.reference_omega_lines.data(data_to_plot);
	            this.reference_omega_lines.enter().append("line");
	            this.reference_omega_lines.exit().remove();
	
	            this.reference_omega_lines.transition().attr("x1", function (d) {
	                return self.omega_scale(d.omega);
	            }).attr("x2", function (d) {
	                return self.omega_scale(d.omega);
	            }).attr("y1", function (d) {
	                return self.proportion_scale(-0.05);
	            }).attr("y2", function (d) {
	                return self.proportion_scale(d.weight);
	            }).style("stroke", function (d) {
	                return "#d62728";
	            }).attr("class", "hyphy-omega-line-reference");
	        } else {
	            this.reference_omega_lines.remove();
	            this.displacement_lines.remove();
	        }
	    },
	    createOmegaLine: function createOmegaLine() {
	
	        var data_to_plot = this.state.omegas["Reference"];
	        var secondary_data = this.state.omegas["Test"];
	        var self = this;
	
	        // ** Omega Line (Red) ** //
	        var omega_lines = this.plot.selectAll(".hyphy-omega-line").data(secondary_data ? secondary_data : data_to_plot);
	        omega_lines.enter().append("line");
	        omega_lines.exit().remove();
	        omega_lines.transition().attr("x1", function (d) {
	            return self.omega_scale(d.omega);
	        }).attr("x2", function (d) {
	            return self.omega_scale(d.omega);
	        }).attr("y1", function (d) {
	            return self.proportion_scale(-0.05);
	        }).attr("y2", function (d) {
	            return self.proportion_scale(d.weight);
	        }).style("stroke", function (d) {
	            return "#1f77b4";
	        }).attr("class", "hyphy-omega-line");
	    },
	    createNeutralLine: function createNeutralLine() {
	        var self = this;
	
	        // ** Neutral Line (Blue) ** //
	        var neutral_line = this.plot.selectAll(".hyphy-neutral-line").data([1]);
	        neutral_line.enter().append("line").attr("class", "hyphy-neutral-line");
	        neutral_line.exit().remove();
	        neutral_line.transition().attr("x1", function (d) {
	            return self.omega_scale(d);
	        }).attr("x2", function (d) {
	            return self.omega_scale(d);
	        }).attr("y1", 0).attr("y2", this.plot_height);
	    },
	    createXAxis: function createXAxis() {
	
	        // *** X-AXIS *** //
	        var xAxis = d3.svg.axis().scale(this.omega_scale).orient("bottom");
	
	        if (this.props.do_log_plot) {
	            xAxis.ticks(10, this.props.has_zeros ? ".2r" : ".1r");
	        }
	
	        var x_axis = this.svg.selectAll(".x.axis");
	        var x_label;
	
	        if (x_axis.empty()) {
	            x_axis = this.svg.append("g").attr("class", "x hyphy-axis");
	
	            x_label = x_axis.append("g").attr("class", "hyphy-axis-label x-label");
	        } else {
	            x_label = x_axis.select(".axis-label.x-label");
	        }
	
	        x_axis.attr("transform", "translate(" + this.props.margins["left"] + "," + (this.plot_height + this.props.margins["top"]) + ")").call(xAxis);
	        x_label = x_label.attr("transform", "translate(" + this.plot_width + "," + this.props.margins["bottom"] + ")").selectAll("text").data(['\u03C9']);
	        x_label.enter().append("text");
	        x_label.text(function (d) {
	            return d;
	        }).style("text-anchor", "end").attr("dy", "0.0em");
	    },
	    createYAxis: function createYAxis() {
	
	        // *** Y-AXIS *** //
	        var yAxis = d3.svg.axis().scale(this.proportion_scale).orient("left").ticks(10, ".1p");
	
	        var y_axis = this.svg.selectAll(".y.hyphy-axis");
	        var y_label;
	
	        if (y_axis.empty()) {
	            y_axis = this.svg.append("g").attr("class", "y hyphy-axis");
	            y_label = y_axis.append("g").attr("class", "hyphy-axis-label y-label");
	        } else {
	            y_label = y_axis.select(".hyphy-axis-label.y-label");
	        }
	        y_axis.attr("transform", "translate(" + this.props.margins["left"] + "," + this.props.margins["top"] + ")").call(yAxis);
	        y_label = y_label.attr("transform", "translate(" + -this.props.margins["left"] + "," + 0 + ")").selectAll("text").data(["Proportion of sites"]);
	        y_label.enter().append("text");
	        y_label.text(function (d) {
	            return d;
	        }).style("text-anchor", "start").attr("dy", "-1em");
	    },
	
	    getInitialState: function getInitialState() {
	        return {
	            omegas: this.props.omegas,
	            settings: this.props.settings
	        };
	    },
	
	    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	
	        this.setState({
	            omegas: nextProps.omegas
	        });
	    },
	
	    componentDidUpdate: function componentDidUpdate() {
	        this.initialize();
	    },
	
	    componentDidMount: function componentDidMount() {
	        this.initialize();
	    },
	
	    render: function render() {
	
	        var key = this.props.omegas.key,
	            label = this.props.omegas.label;
	
	        this.svg_id = key + "-svg";
	        this.save_svg_id = "export-" + key + "-svg";
	        this.save_png_id = "export-" + key + "-png";
	
	        return React.createElement(
	            'div',
	            { className: 'col-lg-6' },
	            React.createElement(
	                'div',
	                { className: 'panel panel-default', id: key },
	                React.createElement(
	                    'div',
	                    { className: 'panel-heading' },
	                    React.createElement(
	                        'h3',
	                        { className: 'panel-title' },
	                        '\u03C9 distributions under the ',
	                        React.createElement(
	                            'strong',
	                            null,
	                            label
	                        ),
	                        ' model'
	                    ),
	                    React.createElement(
	                        'p',
	                        null,
	                        React.createElement(
	                            'small',
	                            null,
	                            'Test branches are shown in ',
	                            React.createElement(
	                                'span',
	                                { className: 'hyphy-blue' },
	                                'blue'
	                            ),
	                            ' and reference branches are shown in ',
	                            React.createElement(
	                                'span',
	                                { className: 'hyphy-red' },
	                                'red'
	                            )
	                        )
	                    ),
	                    React.createElement(
	                        'div',
	                        { className: 'btn-group' },
	                        React.createElement(
	                            'button',
	                            { id: this.save_svg_id, type: 'button', className: 'btn btn-default btn-sm' },
	                            React.createElement('span', { className: 'glyphicon glyphicon-floppy-save' }),
	                            ' SVG'
	                        ),
	                        React.createElement(
	                            'button',
	                            { id: this.save_png_id, type: 'button', className: 'btn btn-default btn-sm' },
	                            React.createElement('span', { className: 'glyphicon glyphicon-floppy-save' }),
	                            ' PNG'
	                        )
	                    )
	                ),
	                React.createElement(
	                    'div',
	                    { className: 'panel-body' },
	                    React.createElement('svg', { id: this.svg_id })
	                )
	            )
	        );
	    }
	});
	
	var OmegaPlotGrid = React.createClass({
	    displayName: 'OmegaPlotGrid',
	
	
	    getInitialState: function getInitialState() {
	        return { omega_distributions: this.getDistributions(this.props.json) };
	    },
	
	    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	
	        this.setState({
	            omega_distributions: this.getDistributions(nextProps.json)
	        });
	    },
	
	    getDistributions: function getDistributions(json) {
	
	        var omega_distributions = {};
	
	        if (!json) {
	            return [];
	        }
	
	        for (var m in json["fits"]) {
	            var this_model = json["fits"][m];
	            omega_distributions[m] = {};
	            var distributions = [];
	            for (var d in this_model["rate-distributions"]) {
	                var this_distro = this_model["rate-distributions"][d];
	                var this_distro_entry = [d, "", "", ""];
	                omega_distributions[m][d] = this_distro.map(function (d) {
	                    return {
	                        'omega': d[0],
	                        'weight': d[1]
	                    };
	                });
	            }
	        }
	
	        _.each(omega_distributions, function (item, key) {
	            item.key = key.toLowerCase().replace(/ /g, '-');
	            item.label = key;
	        });
	
	        var omega_distributions = _.filter(omega_distributions, function (item) {
	            return _.isObject(item["Reference"]);
	        });
	
	        return omega_distributions;
	    },
	
	    render: function render() {
	
	        var OmegaPlots = _.map(this.state.omega_distributions, function (item, key) {
	
	            var model_name = key;
	            var omegas = item;
	
	            var settings = {
	                svg_id: omegas.key + '-svg',
	                dimensions: { width: 600, height: 400 },
	                margins: { 'left': 50, 'right': 15, 'bottom': 35, 'top': 35 },
	                has_zeros: false,
	                legend_id: null,
	                do_log_plot: true,
	                k_p: null,
	                plot: null
	            };
	
	            return React.createElement(OmegaPlot, { name: model_name, omegas: omegas, settings: settings });
	        });
	
	        return React.createElement(
	            'div',
	            null,
	            OmegaPlots
	        );
	    }
	
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(54), __webpack_require__(57)))

/***/ },

/***/ 237:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3, $, _) {"use strict";
	
	__webpack_require__(238);
	__webpack_require__(239);
	__webpack_require__(240);
	
	var React = __webpack_require__(61);
	var datamonkey = __webpack_require__(53);
	
	var SLAC = React.createClass({
	    displayName: "SLAC",
	
	
	    float_format: d3.format(".2f"),
	
	    dm_loadFromServer: function dm_loadFromServer() {
	        /* 20160721 SLKP: prefixing all custom (i.e. not defined by REACT) with dm_
	           to make it easier to recognize scoping immediately */
	
	        var self = this;
	
	        d3.json(self.props.url, function (request_error, data) {
	
	            if (!data) {
	                var error_message_text = request_error.status == 404 ? self.props.url + " could not be loaded" : request_error.statusText;
	                self.setState({ error_message: error_message_text });
	            } else {
	                self.dm_initializeFromJSON(data);
	            }
	        });
	    },
	
	    dm_initializeFromJSON: function dm_initializeFromJSON(data) {
	        this.setState({ analysis_results: data });
	    },
	
	    getDefaultProps: function getDefaultProps() {
	        /* default properties for the component */
	
	        return {
	            url: "#"
	        };
	    },
	
	    getInitialState: function getInitialState() {
	
	        return {
	            analysis_results: null,
	            error_message: null,
	            pValue: 0.1
	        };
	    },
	
	    componentWillMount: function componentWillMount() {
	        this.dm_loadFromServer();
	        this.dm_setEvents();
	    },
	
	    dm_setEvents: function dm_setEvents() {
	
	        var self = this;
	
	        $("#datamonkey-json-file").on("change", function (e) {
	
	            var files = e.target.files; // FileList object
	
	            if (files.length == 1) {
	                var f = files[0];
	                var reader = new FileReader();
	
	                reader.onload = function (theFile) {
	                    return function (e) {
	                        try {
	                            self.dm_initializeFromJSON(JSON.parse(this.result));
	                        } catch (error) {
	                            self.setState({ error_message: error.toString() });
	                        }
	                    };
	                }(f);
	
	                reader.readAsText(f);
	            }
	
	            $("#datamonkey-json-file-toggle").dropdown("toggle");
	        });
	    },
	
	    dm_adjustPvalue: function dm_adjustPvalue(event) {
	        this.setState({ pValue: parseFloat(event.target.value) });
	    },
	
	    render: function render() {
	
	        var self = this;
	
	        if (self.state.error_message) {
	            return React.createElement(
	                "div",
	                { id: "datamonkey-error", className: "alert alert-danger alert-dismissible", role: "alert" },
	                React.createElement(
	                    "button",
	                    { type: "button", className: "close", "data-dismiss": "alert", "aria-label": "Close" },
	                    React.createElement(
	                        "span",
	                        { "aria-hidden": "true" },
	                        "\xD7"
	                    )
	                ),
	                React.createElement(
	                    "strong",
	                    null,
	                    self.state.error_message
	                ),
	                " ",
	                React.createElement("span", { id: "datamonkey-error-text" })
	            );
	        }
	
	        if (self.state.analysis_results) {
	
	            return React.createElement(
	                "div",
	                { className: "tab-content" },
	                React.createElement(
	                    "div",
	                    { className: "tab-pane", id: "summary_tab" },
	                    React.createElement(
	                        "div",
	                        { className: "row" },
	                        React.createElement(
	                            "div",
	                            { id: "summary-div", className: "col-md-12" },
	                            React.createElement(SLACBanner, { analysis_results: self.state.analysis_results, pValue: self.state.pValue, pAdjuster: _.bind(self.dm_adjustPvalue, self) })
	                        )
	                    ),
	                    React.createElement(
	                        "div",
	                        { className: "row hidden-print" },
	                        React.createElement(
	                            "div",
	                            { id: "datamonkey-slac-tree-summary", className: "col-lg-4 col-md-6 col-sm-12" },
	                            React.createElement(
	                                "div",
	                                { className: "panel panel-default" },
	                                React.createElement(
	                                    "div",
	                                    { className: "panel-heading" },
	                                    React.createElement(
	                                        "h3",
	                                        { className: "panel-title" },
	                                        React.createElement("i", { className: "fa fa-puzzle-piece" }),
	                                        " Partition information"
	                                    )
	                                ),
	                                React.createElement(
	                                    "div",
	                                    { className: "panel-body" },
	                                    React.createElement(
	                                        "small",
	                                        null,
	                                        React.createElement(DatamonkeyPartitionTable, {
	                                            pValue: self.state.pValue,
	                                            trees: self.state.analysis_results.trees,
	                                            partitions: self.state.analysis_results.partitions,
	                                            branchAttributes: self.state.analysis_results['branch attributes'],
	                                            siteResults: self.state.analysis_results.MLE,
	                                            accessorPositive: function accessorPositive(json, partition) {
	                                                return _.map(json["content"][partition]["by-site"]["AVERAGED"], function (v) {
	                                                    return v[8];
	                                                });
	                                            },
	                                            accessorNegative: function accessorNegative(json, partition) {
	                                                return _.map(json["content"][partition]["by-site"]["AVERAGED"], function (v) {
	                                                    return v[9];
	                                                });
	                                            }
	                                        })
	                                    )
	                                )
	                            )
	                        ),
	                        React.createElement(
	                            "div",
	                            { id: "datamonkey-slac-model-fits", className: "col-lg-5 col-md-6 col-sm-12" },
	                            React.createElement(
	                                "div",
	                                { className: "panel panel-default" },
	                                React.createElement(
	                                    "div",
	                                    { className: "panel-heading" },
	                                    React.createElement(
	                                        "h3",
	                                        { className: "panel-title" },
	                                        React.createElement("i", { className: "fa fa-table" }),
	                                        " Model fits"
	                                    )
	                                ),
	                                React.createElement(
	                                    "div",
	                                    { className: "panel-body" },
	                                    React.createElement(
	                                        "small",
	                                        null,
	                                        React.createElement(DatamonkeyModelTable, { fits: self.state.analysis_results.fits })
	                                    )
	                                )
	                            )
	                        ),
	                        React.createElement(
	                            "div",
	                            { id: "datamonkey-slac-timers", className: "col-lg-3 col-md-3 col-sm-12" },
	                            React.createElement(
	                                "div",
	                                { className: "panel panel-default" },
	                                React.createElement(
	                                    "div",
	                                    { className: "panel-heading" },
	                                    React.createElement(
	                                        "h3",
	                                        { className: "panel-title" },
	                                        React.createElement("i", { className: "fa fa-clock-o" }),
	                                        " Execution time"
	                                    )
	                                ),
	                                React.createElement(
	                                    "div",
	                                    { className: "panel-body" },
	                                    React.createElement(
	                                        "small",
	                                        null,
	                                        React.createElement(DatamonkeyTimersTable, { timers: self.state.analysis_results.timers, totalTime: "Total time" })
	                                    )
	                                )
	                            )
	                        )
	                    )
	                ),
	                React.createElement(
	                    "div",
	                    { className: "tab-pane active", id: "sites_tab" },
	                    React.createElement(
	                        "div",
	                        { className: "row" },
	                        React.createElement(
	                            "div",
	                            { id: "summary-div", className: "col-md-12" },
	                            React.createElement(SLACSites, {
	                                headers: self.state.analysis_results.MLE.headers,
	                                mle: datamonkey.helpers.map(datamonkey.helpers.filter(self.state.analysis_results.MLE.content, function (value, key) {
	                                    return _.has(value, "by-site");
	                                }), function (value, key) {
	                                    return value["by-site"];
	                                }),
	                                sample25: self.state.analysis_results["sample-2.5"],
	                                sampleMedian: self.state.analysis_results["sample-median"],
	                                sample975: self.state.analysis_results["sample-97.5"],
	                                partitionSites: self.state.analysis_results.partitions
	                            })
	                        )
	                    )
	                ),
	                React.createElement("div", { className: "tab-pane", id: "tree_tab" })
	            );
	        }
	        return null;
	    }
	
	});
	
	// Will need to make a call to this
	// omega distributions
	function render_slac(url, element) {
	    ReactDOM.render(React.createElement(SLAC, { url: url }), document.getElementById(element));
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(54), __webpack_require__(15), __webpack_require__(57)))

/***/ },

/***/ 238:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_, d3) {'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var React = __webpack_require__(61);
	var datamonkey = __webpack_require__(53);
	
	var DatamonkeyTableRow = React.createClass({
	    displayName: 'DatamonkeyTableRow',
	
	    /**
	        A single table row
	    
	        *rowData* is an array of cells
	            each cell can be one of
	                1. string: simply render the text as shown
	                2. object: a polymorphic case; can be rendered directly (if the object is a valid react.js element)
	                   or via a transformation of the value associated with the key 'value'
	    
	                   supported keys
	                    2.1. 'value' : the value to use to generate cell context
	                    2.2. 'format' : the function (returning something react.js can render directly) that will be called
	                    to transform 'value' into the object to be rendered
	                    2.3. 'span' : colSpan attribute
	                    2.4. 'style': CSS style attributes (JSX specification, i.e. {margin-top: '1em'} and not a string)
	                    2.5. 'classes': CSS classes to apply to the cell
	                    2.6. 'abbr': wrap cell value in <abbr> tags
	    
	                3. array: directly render array elements in the cell (must be renderable to react.js; note that plain
	                text elements will be wrapped in "span" which is not allowed to nest in <th/td>
	    
	    
	        *header* is a bool indicating whether the header is a header row (th cells) or a regular row (td cells)
	    */
	
	    /*propTypes: {
	     rowData: React.PropTypes.arrayOf (React.PropTypes.oneOfType ([React.PropTypes.string,React.PropTypes.number,React.PropTypes.object,React.PropTypes.array])).isRequired,
	     header:  React.PropTypes.bool,
	    },*/
	
	    dm_compareTwoValues: function dm_compareTwoValues(a, b) {
	        /**
	            compare objects by iterating over keys
	        */
	
	        var myType = typeof a === 'undefined' ? 'undefined' : _typeof(a),
	            self = this;
	
	        if (myType == (typeof b === 'undefined' ? 'undefined' : _typeof(b))) {
	            if (myType == "string" || myType == "number") {
	                return a == b ? 1 : 0;
	            }
	
	            if (_.isArray(a) && _.isArray(b)) {
	
	                if (a.length != b.length) {
	                    return 0;
	                }
	
	                var not_compared = 0;
	                var result = _.every(a, function (c, i) {
	                    var comp = self.dm_compareTwoValues(c, b[i]);if (comp < 0) {
	                        not_compared = comp;return false;
	                    }return comp == 1;
	                });
	
	                if (not_compared < 0) {
	                    return not_compared;
	                }
	
	                return result ? 1 : 0;
	            }
	
	            return -2;
	        }
	        return -1;
	    },
	
	    dm_log100times: _.before(100, function (v) {
	        console.log(v);
	        return 0;
	    }),
	
	    shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
	
	        var self = this;
	
	        if (this.props.header !== nextProps.header) {
	            return true;
	        }
	
	        var result = _.some(this.props.rowData, function (value, index) {
	            /** TO DO
	                check for format and other field equality
	            */
	            if (value === nextProps.rowData[index]) {
	                return false;
	            }
	
	            var compare = self.dm_compareTwoValues(value, nextProps.rowData[index]);
	            if (compare >= 0) {
	                return compare == 0;
	            }
	
	            if (compare == -2) {
	                if (_.has(value, "value") && _.has(nextProps.rowData[index], "value")) {
	                    return self.dm_compareTwoValues(value.value, nextProps.rowData[index].value) != 1;
	                }
	            }
	
	            return true;
	        });
	
	        if (result) {
	            this.dm_log100times(["Old", this.props.rowData, "New", nextProps.rowData]);
	        }
	
	        return result;
	    },
	
	    render: function render() {
	        return React.createElement(
	            'tr',
	            null,
	            this.props.rowData.map(_.bind(function (cell, index) {
	
	                var value = _.has(cell, "value") ? cell.value : cell;
	
	                if (_.isArray(value)) {
	                    if (!_.has(cell, "format")) {
	                        return value;
	                    }
	                } else {
	                    if (_.isObject(value)) {
	                        if (!React.isValidElement(value)) {
	                            return null;
	                        }
	                    }
	                }
	
	                if (_.has(cell, "format")) {
	                    value = cell.format(value);
	                }
	
	                if (_.has(cell, "abbr")) {
	                    value = React.createElement(
	                        'abbr',
	                        { title: cell.abbr },
	                        value
	                    );
	                }
	
	                var cellProps = { key: index };
	
	                if (_.has(cell, "span")) {
	                    cellProps["colSpan"] = cell.span;
	                }
	
	                if (_.has(cell, "style")) {
	                    cellProps["style"] = cell.style;
	                }
	
	                if (_.has(cell, "classes")) {
	                    cellProps["className"] = cell.classes;
	                }
	
	                return React.createElement(this.props.header ? "th" : "td", cellProps, value);
	            }, this))
	        );
	    }
	});
	
	var DatamonkeyTable = React.createClass({
	    displayName: 'DatamonkeyTable',
	
	    /**
	        A table composed of rows
	            *headerData* -- an array of cells (see DatamonkeyTableRow) to render as the header
	            *bodyData* -- an array of arrays of cells (rows) to render
	            *classes* -- CSS classes to apply to the table element
	    */
	
	    /*propTypes: {
	        headerData: React.PropTypes.array,
	        bodyData: React.PropTypes.arrayOf (React.PropTypes.array),
	    },*/
	
	    getDefaultProps: function getDefaultProps() {
	        return { classes: "table table-condensed table-hover",
	            rowHash: null,
	            sortableColumns: new Object(null),
	            initialSort: null
	        };
	    },
	
	    getInitialState: function getInitialState() {
	        return { sortedOn: this.props.initialSort };
	    },
	
	    render: function render() {
	        var children = [];
	
	        if (this.props.headerData) {
	            if (_.isArray(this.props.headerData[0])) {
	                // multiple rows
	                children.push(React.createElement(
	                    'thead',
	                    { key: 0 },
	                    _.map(this.props.headerData, function (row, index) {
	                        return React.createElement(DatamonkeyTableRow, { rowData: row, header: true, key: index });
	                    })
	                ));
	            } else {
	                children.push(React.createElement(
	                    'thead',
	                    { key: 0 },
	                    React.createElement(DatamonkeyTableRow, { rowData: this.props.headerData, header: true })
	                ));
	            }
	        }
	
	        children.push(React.createElement("tbody", { key: 1 }, _.map(this.props.bodyData, _.bind(function (componentData, index) {
	            return React.createElement(DatamonkeyTableRow, { rowData: componentData, key: this.props.rowHash ? this.props.rowHash(componentData) : index, header: false });
	        }, this))));
	
	        return React.createElement("table", { className: this.props.classes }, children);
	    }
	});
	
	var DatamonkeyRateDistributionTable = React.createClass({
	    displayName: 'DatamonkeyRateDistributionTable',
	
	
	    /** render a rate distribution table from JSON formatted like this
	    {
	         "non-synonymous/synonymous rate ratio for *background*":[ // name of distribution
	          [0.1701428265961598, 1] // distribution points (rate, weight)
	          ],
	         "non-synonymous/synonymous rate ratio for *test*":[
	          [0.1452686330406915, 1]
	          ]
	    }
	     */
	
	    propTypes: {
	        distribution: React.PropTypes.object.isRequired
	    },
	
	    dm_formatterRate: d3.format(".3r"),
	    dm_formatterProp: d3.format(".3p"),
	
	    dm_createDistributionTable: function dm_createDistributionTable(jsonRates) {
	        var rowData = [];
	        var self = this;
	        _.each(jsonRates, function (value, key) {
	            rowData.push([{ value: key, span: 3, classes: "info" }]);
	            _.each(value, function (rate, index) {
	                rowData.push([{ value: rate[1], format: self.dm_formatterProp }, '@', { value: rate[0], format: self.dm_formatterRate }]);
	            });
	        });
	        return rowData;
	    },
	
	    render: function render() {
	        return React.createElement(DatamonkeyTable, { bodyData: this.dm_createDistributionTable(this.props.distribution), classes: "table table-condensed" });
	    }
	
	});
	
	var DatamonkeyPartitionTable = React.createClass({
	    displayName: 'DatamonkeyPartitionTable',
	
	
	    dm_formatterFloat: d3.format(".3r"),
	    dm_formatterProp: d3.format(".3p"),
	
	    propTypes: {
	        trees: React.PropTypes.object.isRequired,
	        partitions: React.PropTypes.object.isRequired,
	        branchAttributes: React.PropTypes.object.isRequired,
	        siteResults: React.PropTypes.object.isRequired,
	        accessorNegative: React.PropTypes.func.isRequired,
	        accessorPositive: React.PropTypes.func.isRequired,
	        pValue: React.PropTypes.number.isRequired
	    },
	
	    dm_computePartitionInformation: function dm_computePartitionInformation(trees, partitions, attributes, pValue) {
	
	        var partitionKeys = _.sortBy(_.keys(partitions), function (v) {
	            return v;
	        }),
	            matchingKey = null,
	            self = this;
	
	        var extractBranchLength = this.props.extractOn || _.find(attributes.attributes, function (value, key) {
	            matchingKey = key;return value["attribute type"] == "branch length";
	        });
	        if (matchingKey) {
	            extractBranchLength = matchingKey;
	        }
	
	        return _.map(partitionKeys, function (key, index) {
	            var treeBranches = trees.tested[key],
	                tested = {};
	
	            _.each(treeBranches, function (value, key) {
	                if (value == "test") tested[key] = 1;
	            });
	
	            var testedLength = extractBranchLength ? datamonkey.helpers.sum(attributes[key], function (v, k) {
	                if (tested[k.toUpperCase()]) {
	                    return v[extractBranchLength];
	                }return 0;
	            }) : 0;
	            var totalLength = extractBranchLength ? datamonkey.helpers.sum(attributes[key], function (v) {
	                return v[extractBranchLength] || 0;
	            }) : 0; // || 0 is to resolve root node missing length
	
	
	            return _.map([index + 1, // 1-based partition index
	            partitions[key].coverage[0].length, // number of sites in the partition
	            _.size(tested), // tested branches
	            _.keys(treeBranches).length, // total branches
	            testedLength, testedLength / totalLength, totalLength, _.filter(self.props.accessorPositive(self.props.siteResults, key), function (p) {
	                return p <= pValue;
	            }).length, _.filter(self.props.accessorNegative(self.props.siteResults, key), function (p) {
	                return p <= pValue;
	            }).length], function (cell, index) {
	                if (index > 1) {
	                    var attributedCell = { value: cell,
	                        style: { textAlign: 'center' } };
	
	                    if (index == 4 || index == 6) {
	                        _.extend(attributedCell, { 'format': self.dm_formatterFloat });
	                    }
	                    if (index == 5) {
	                        _.extend(attributedCell, { 'format': self.dm_formatterProp });
	                    }
	
	                    return attributedCell;
	                }
	                return cell;
	            });
	        });
	    },
	
	    dm_makeHeaderRow: function dm_makeHeaderRow(pValue) {
	        return [_.map(["Partition", "Sites", "Branches", "Branch Length", "Selected at p" + String.fromCharCode(parseInt("2264", 16)) + pValue], function (d, i) {
	            return _.extend({ value: d, style: { borderBottom: 0, textAlign: i > 1 ? 'center' : 'left' } }, i > 1 ? { 'span': i == 3 ? 3 : 2 } : {});
	        }), _.map(["", "", "Tested", "Total", "Tested", "% of total", "Total", "Positive", "Negative"], function (d, i) {
	            return { value: d, style: { borderTop: 0, textAlign: i > 1 ? 'center' : 'left' } };
	        })];
	    },
	
	    getInitialState: function getInitialState() {
	        return {
	            header: this.dm_makeHeaderRow(this.props.pValue),
	            rows: this.dm_computePartitionInformation(this.props.trees, this.props.partitions, this.props.branchAttributes, this.props.pValue)
	        };
	    },
	
	    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	        this.setState({
	            header: this.dm_makeHeaderRow(nextProps.pValue),
	            rows: this.dm_computePartitionInformation(nextProps.trees, nextProps.partitions, nextProps.branchAttributes, nextProps.pValue)
	        });
	    },
	
	    render: function render() {
	        return React.createElement(
	            'div',
	            { className: 'table-responsive' },
	            React.createElement(DatamonkeyTable, { headerData: this.state.header, bodyData: this.state.rows })
	        );
	    }
	});
	
	var DatamonkeyModelTable = React.createClass({
	    displayName: 'DatamonkeyModelTable',
	
	
	    /** render a model fit table from a JSON object with entries like this
	            "Global MG94xREV":{ // model name
	               "log likelihood":-5453.527975908821,
	               "parameters":131,
	               "AIC-c":11172.05569160427,
	               "rate distributions":{
	                 "non-synonymous/synonymous rate ratio for *background*":[
	                  [0.1701428265961598, 1]
	                  ],
	                 "non-synonymous/synonymous rate ratio for *test*":[
	                  [0.1452686330406915, 1]
	                  ]
	                },
	               "display order":0
	              }
	       dm_supportedColumns controls which keys from model specification will be consumed;
	          * 'value' is the cell specification to be consumed by DatamonkeyTableRow
	          * 'order' is the column order in the resulting table (relative; doesn't have to be sequential)
	          * 'display_format' is a formatting function for cell entries
	          * 'transform' is a data trasformation function for cell entries
	     */
	
	    dm_numberFormatter: d3.format(".2f"),
	
	    dm_supportedColumns: { 'log likelihood': { order: 2,
	            value: { "value": "log L", "abbr": "log likelihood" },
	            display_format: d3.format(".2f") },
	        'parameters': { order: 3,
	            value: "Parameters" },
	        'AIC-c': { order: 1,
	            value: { value: React.createElement('span', null, ['AIC', React.createElement(
	                    'sub',
	                    { key: '0' },
	                    'C'
	                )]),
	                abbr: "Small-sample corrected Akaike Information Score" },
	            display_format: d3.format(".2f") },
	        'rate distributions': { order: 4,
	            value: "Rate distributions",
	            transform: function transform(value) {
	                return React.createElement(DatamonkeyRateDistributionTable, { distribution: value });
	            } }
	    },
	
	    propTypes: {
	        fits: React.PropTypes.object.isRequired
	    },
	
	    getDefaultProps: function getDefaultProps() {
	        return {
	            orderOn: "display order"
	        };
	    },
	
	    dm_extractFitsTable: function dm_extractFitsTable(jsonTable) {
	        var modelList = [];
	        var columnMap = null;
	        var columnMapIterator = [];
	        var valueFormat = {};
	        var valueTransform = {};
	        var rowData = [];
	        var self = this;
	
	        _.each(jsonTable, function (value, key) {
	            if (!columnMap) {
	                columnMap = {};
	                _.each(value, function (cellValue, cellName) {
	                    if (self.dm_supportedColumns[cellName]) {
	                        columnMap[cellName] = self.dm_supportedColumns[cellName];
	                        columnMapIterator[columnMap[cellName].order] = cellName;
	                        valueFormat[cellName] = self.dm_supportedColumns[cellName]["display_format"];
	                        if (_.isFunction(self.dm_supportedColumns[cellName]["transform"])) {
	                            valueTransform[cellName] = self.dm_supportedColumns[cellName]["transform"];
	                        }
	                    }
	                });
	                columnMapIterator = _.filter(columnMapIterator, function (v) {
	                    return v;
	                });
	            }
	
	            var thisRow = [{ value: key, style: { fontVariant: "small-caps" } }];
	
	            _.each(columnMapIterator, function (tag) {
	
	                var myValue = valueTransform[tag] ? valueTransform[tag](value[tag]) : value[tag];
	
	                if (valueFormat[tag]) {
	                    thisRow.push({ 'value': myValue, 'format': valueFormat[tag] });
	                } else {
	                    thisRow.push(myValue);
	                }
	            });
	
	            rowData.push([thisRow, _.isNumber(value[self.props.orderOn]) ? value[self.props.orderOn] : rowData.length]);
	        });
	
	        return { 'data': _.map(_.sortBy(rowData, function (value) {
	                return value[1];
	            }), function (r) {
	                return r[0];
	            }),
	            'columns': _.map(columnMapIterator, function (tag) {
	                return columnMap[tag].value;
	            }) };
	    },
	
	    dm_makeHeaderRow: function dm_makeHeaderRow(columnMap) {
	        var headerRow = ['Model'];
	        _.each(columnMap, function (v) {
	            headerRow.push(v);
	        });
	        return headerRow;
	    },
	
	    getInitialState: function getInitialState() {
	
	        var tableInfo = this.dm_extractFitsTable(this.props.fits);
	
	        return {
	            header: this.dm_makeHeaderRow(tableInfo.columns),
	            rows: tableInfo.data,
	            caption: null
	        };
	    },
	
	    render: function render() {
	        return React.createElement(
	            'div',
	            { className: 'table-responsive' },
	            React.createElement(DatamonkeyTable, { headerData: this.state.header, bodyData: this.state.rows })
	        );
	    }
	});
	
	var DatamonkeyTimersTable = React.createClass({
	    displayName: 'DatamonkeyTimersTable',
	
	
	    dm_percentageFormatter: d3.format(".2%"),
	
	    propTypes: {
	        timers: React.PropTypes.object.isRequired
	    },
	
	    dm_formatSeconds: function dm_formatSeconds(seconds) {
	
	        var fields = [~~(seconds / 3600), ~~(seconds % 3600 / 60), seconds % 60];
	
	        return _.map(fields, function (d) {
	            return d < 10 ? "0" + d : "" + d;
	        }).join(':');
	    },
	
	    dm_extractTimerTable: function dm_extractTimerTable(jsonTable) {
	        var totalTime = 0.,
	            formattedRows = _.map(jsonTable, _.bind(function (value, key) {
	            if (this.props.totalTime) {
	                if (key == this.props.totalTime) {
	                    totalTime = value['timer'];
	                }
	            } else {
	                totalTime += value['timer'];
	            }
	            return [key, value['timer'], value['order']];
	        }, this));
	
	        formattedRows = _.sortBy(formattedRows, function (row) {
	            return row[2];
	        });
	
	        formattedRows = _.map(formattedRows, _.bind(function (row) {
	            var fraction = null;
	            if (this.props.totalTime === null || this.props.totalTime != row[0]) {
	                row[2] = { "value": row[1] / totalTime, "format": this.dm_percentageFormatter };
	            } else {
	                row[2] = "";
	            }
	            row[1] = this.dm_formatSeconds(row[1]);
	            return row;
	        }, this));
	
	        return formattedRows;
	    },
	
	    dm_makeHeaderRow: function dm_makeHeaderRow() {
	        return ['Task', 'Time', '%'];
	    },
	
	    getInitialState: function getInitialState() {
	
	        return {
	            header: this.dm_makeHeaderRow(),
	            rows: this.dm_extractTimerTable(this.props.timers),
	            caption: null
	        };
	    },
	
	    render: function render() {
	        return React.createElement(DatamonkeyTable, { headerData: this.state.header, bodyData: this.state.rows });
	    }
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(57), __webpack_require__(54)))

/***/ },

/***/ 239:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3, _) {'use strict';
	
	var React = __webpack_require__(61);
	var datamonkey = __webpack_require__(53);
	
	var SLACSites = React.createClass({
	    displayName: 'SLACSites',
	
	    propTypes: {
	        headers: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.string)).isRequired,
	        mle: React.PropTypes.object.isRequired,
	        sample25: React.PropTypes.object,
	        sampleMedian: React.PropTypes.object,
	        sample975: React.PropTypes.object,
	        initialAmbigHandling: React.PropTypes.string.isRequired,
	        partitionSites: React.PropTypes.object.isRequired
	    },
	
	    getInitialState: function getInitialState() {
	        var canDoCI = this.props.sample25 && this.props.sampleMedian && this.props.sample975;
	
	        return {
	
	            ambigOptions: this.dm_AmbigOptions(this.props),
	            ambigHandling: this.props.initialAmbigHandling,
	            filters: new Object(null),
	            showIntervals: canDoCI,
	            hasCI: canDoCI
	        };
	    },
	
	    getDefaultProps: function getDefaultProps() {
	
	        return {
	            sample25: null,
	            sampleMedian: null,
	            sample975: null,
	            initialAmbigHandling: "RESOLVED"
	        };
	    },
	
	    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	        this.setState({
	
	            ambigOptions: this.dm_AmbigOptions(nextProps),
	            ambigHandling: nextProps.initialAmbigHandling
	        });
	    },
	
	    dm_formatNumber: d3.format(".3r"),
	    dm_formatNumberShort: d3.format(".2r"),
	
	    dm_log10times: _.before(10, function (v) {
	        console.log(v);
	        return 0;
	    }),
	
	    dm_formatInterval: function dm_formatInterval(values) {
	        //this.dm_log10times (values);
	
	        return this.dm_formatNumber(values[0]) + " / " + this.dm_formatNumber(values[2]) + " [" + this.dm_formatNumber(values[1]) + " : " + this.dm_formatNumber(values[3]) + "]";
	    },
	
	    dm_AmbigOptions: function dm_AmbigOptions(theseProps) {
	        return _.keys(theseProps.mle[0]);
	    },
	
	    dm_changeAmbig: function dm_changeAmbig(event) {
	
	        this.setState({
	            ambigHandling: event.target.value
	        });
	    },
	
	    dm_toggleIntervals: function dm_toggleIntervals(event) {
	        this.setState({
	            showIntervals: !this.state.showIntervals
	        });
	    },
	
	    dm_toggleVariableFilter: function dm_toggleVariableFilter(event) {
	
	        var filterState = new Object(null);
	        _.extend(filterState, this.state.filters);
	        filterState["variable"] = this.state.filters["variable"] == "on" ? "off" : "on";
	        this.setState({ filters: filterState });
	    },
	
	    dm_makeFilterFunction: function dm_makeFilterFunction() {
	
	        var filterFunction = null;
	
	        _.each(this.state.filters, function (value, key) {
	            var composeFunction = null;
	
	            switch (key) {
	                case "variable":
	                    {
	                        if (value == "on") {
	                            composeFunction = function composeFunction(f, partitionIndex, index, site, siteData) {
	                                return (!f || f(partitionIndex, index, site, siteData)) && siteData[2] + siteData[3] > 0;
	                            };
	                        }
	                        break;
	                    }
	            }
	
	            if (composeFunction) {
	                filterFunction = _.wrap(filterFunction, composeFunction);
	            }
	        });
	
	        return filterFunction;
	    },
	
	    dm_makeHeaderRow: function dm_makeHeaderRow() {
	
	        var headers = ['Partition', 'Site'],
	            doCI = this.state.showIntervals;
	
	        if (doCI) {
	            var secondRow = ['', ''];
	
	            _.each(this.props.headers, function (value) {
	                headers.push({ value: value[0], abbr: value[1], span: 4, style: { textAlign: 'center' } });
	                secondRow.push('MLE');
	                secondRow.push('Med');
	                secondRow.push('2.5%');
	                secondRow.push('97.5%');
	            });
	            return [headers, secondRow];
	        } else {
	
	            _.each(this.props.headers, function (value) {
	                headers.push({ value: value[0], abbr: value[1] });
	            });
	        }
	        return headers;
	    },
	
	    dm_makeDataRows: function dm_makeDataRows(filter) {
	
	        var rows = [],
	            partitionCount = datamonkey.helpers.countPartitionsJSON(this.props.partitionSites),
	            partitionIndex = 0,
	            self = this,
	            doCI = this.state.showIntervals;
	
	        while (partitionIndex < partitionCount) {
	
	            _.each(self.props.partitionSites[partitionIndex].coverage[0], function (site, index) {
	                var siteData = self.props.mle[partitionIndex][self.state.ambigHandling][index];
	                if (!filter || filter(partitionIndex, index, site, siteData)) {
	                    var thisRow = [partitionIndex + 1, site + 1];
	                    //secondRow = doCI ? ['',''] : null;
	
	                    _.each(siteData, function (estimate, colIndex) {
	
	                        if (doCI) {
	                            thisRow.push({ value: estimate, format: self.dm_formatNumber });
	                            thisRow.push({ value: self.props.sample25[partitionIndex][self.state.ambigHandling][index][colIndex], format: self.dm_formatNumberShort });
	                            thisRow.push({ value: self.props.sampleMedian[partitionIndex][self.state.ambigHandling][index][colIndex], format: self.dm_formatNumberShort });
	                            thisRow.push({ value: self.props.sample975[partitionIndex][self.state.ambigHandling][index][colIndex], format: self.dm_formatNumberShort });
	
	                            /*thisRow.push ({value: [estimate, self.props.sample25[partitionIndex][self.state.ambigHandling][index][colIndex],
	                                                             self.props.sampleMedian[partitionIndex][self.state.ambigHandling][index][colIndex],
	                                                             self.props.sample975[partitionIndex][self.state.ambigHandling][index][colIndex]],
	                                           format: self.dm_formatInterval,
	                                            }); */
	                        } else {
	                            thisRow.push({ value: estimate, format: self.dm_formatNumber });
	                        }
	                    });
	                    rows.push(thisRow);
	                    //if (secondRow) {
	                    //    rows.push (secondRow);
	                    //}
	                }
	            });
	
	            partitionIndex++;
	        }
	
	        return rows;
	    },
	
	    render: function render() {
	
	        var self = this;
	
	        var result = React.createElement(
	            'div',
	            { className: 'table-responsive' },
	            React.createElement(
	                'form',
	                { className: 'form-inline navbar-form navbar-left' },
	                React.createElement(
	                    'div',
	                    { className: 'form-group' },
	                    React.createElement(
	                        'div',
	                        { className: 'btn-group' },
	                        React.createElement(
	                            'button',
	                            { className: 'btn btn-default btn-sm dropdown-toggle', type: 'button', 'data-toggle': 'dropdown', 'aria-haspopup': 'true', 'aria-expanded': 'false' },
	                            'Display Options ',
	                            React.createElement('span', { className: 'caret' })
	                        ),
	                        React.createElement(
	                            'ul',
	                            { className: 'dropdown-menu' },
	                            React.createElement(
	                                'li',
	                                { key: 'variable' },
	                                React.createElement(
	                                    'div',
	                                    { className: 'checkbox' },
	                                    React.createElement('input', { type: 'checkbox', checked: self.state.filters["variable"] == "on" ? true : false, defaultChecked: self.state.filters["variable"] == "on" ? true : false, onChange: self.dm_toggleVariableFilter }),
	                                    ' Variable sites only'
	                                )
	                            ),
	                            self.state.hasCI ? React.createElement(
	                                'li',
	                                { key: 'intervals' },
	                                React.createElement(
	                                    'div',
	                                    { className: 'checkbox' },
	                                    React.createElement('input', { type: 'checkbox', checked: self.state.showIntervals, defaultChecked: self.state.showIntervals, onChange: self.dm_toggleIntervals }),
	                                    ' Show sampling confidence intervals'
	                                )
	                            ) : null
	                        )
	                    ),
	                    React.createElement(
	                        'div',
	                        { className: 'input-group' },
	                        React.createElement(
	                            'div',
	                            { className: 'input-group-addon' },
	                            'Ambiguities are '
	                        ),
	                        React.createElement(
	                            'select',
	                            { className: 'form-control input-sm', defaultValue: self.state.ambigHandling, onChange: self.dm_changeAmbig },
	                            _.map(this.state.ambigOptions, function (value, index) {
	                                return React.createElement(
	                                    'option',
	                                    { key: index, value: value },
	                                    value
	                                );
	                            })
	                        )
	                    )
	                )
	            ),
	            React.createElement(DatamonkeyTable, { headerData: this.dm_makeHeaderRow(), bodyData: this.dm_makeDataRows(this.dm_makeFilterFunction()) })
	        );
	
	        return result;
	    }
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(54), __webpack_require__(57)))

/***/ },

/***/ 240:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_, d3) {'use strict';
	
	var React = __webpack_require__(61);
	var datamonkey = __webpack_require__(53);
	
	var SLACBanner = React.createClass({
	  displayName: 'SLACBanner',
	
	
	  dm_countSites: function dm_countSites(json, cutoff) {
	
	    var result = { all: 0,
	      positive: 0,
	      negative: 0 };
	
	    result.all = datamonkey.helpers.countSitesFromPartitionsJSON(json);
	
	    result.positive = datamonkey.helpers.sum(json["MLE"]["content"], function (partition) {
	      return _.reduce(partition["by-site"]["RESOLVED"], function (sum, row) {
	        return sum + (row[8] <= cutoff ? 1 : 0);
	      }, 0);
	    });
	
	    result.negative = datamonkey.helpers.sum(json["MLE"]["content"], function (partition) {
	      return _.reduce(partition["by-site"]["RESOLVED"], function (sum, row) {
	        return sum + (row[9] <= cutoff ? 1 : 0);
	      }, 0);
	    });
	
	    return result;
	  },
	
	  dm_computeState: function dm_computeState(state, pvalue) {
	    return {
	      sites: this.dm_countSites(state, pvalue)
	    };
	  },
	
	  dm_formatP: d3.format(".3f"),
	
	  getInitialState: function getInitialState() {
	    return this.dm_computeState(this.props.analysis_results, this.props.pValue);
	  },
	
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    this.setState(this.dm_computeState(nextProps.analysis_results, nextProps.pValue));
	  },
	
	  render: function render() {
	
	    return React.createElement(
	      'div',
	      { className: 'panel panel-primary' },
	      React.createElement(
	        'div',
	        { className: 'panel-heading' },
	        React.createElement(
	          'h3',
	          { className: 'panel-title' },
	          React.createElement(
	            'abbr',
	            { title: 'Single Likelihood Ancestor Counting' },
	            'SLAC'
	          ),
	          ' analysis summary'
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'panel-body' },
	        React.createElement(
	          'span',
	          { className: 'lead' },
	          'Evidence',
	          React.createElement(
	            'sup',
	            null,
	            '\u2020'
	          ),
	          ' of pervasive ',
	          React.createElement(
	            'span',
	            { className: 'hyphy-red' },
	            'diversifying'
	          ),
	          ' / ',
	          React.createElement(
	            'span',
	            { className: 'hyphy-navy' },
	            'purifying'
	          ),
	          ' selection was found at',
	          React.createElement(
	            'strong',
	            { className: 'hyphy-red' },
	            ' ',
	            this.state.sites.positive
	          ),
	          ' / ',
	          React.createElement(
	            'strong',
	            { className: 'hyphy-navy' },
	            this.state.sites.negative
	          ),
	          ' sites among ',
	          this.state.sites.all,
	          ' tested sites'
	        ),
	        React.createElement(
	          'div',
	          { style: { marginBottom: '0em' } },
	          React.createElement(
	            'small',
	            null,
	            React.createElement(
	              'sup',
	              null,
	              '\u2020'
	            ),
	            'Extended binomial test, p \u2264 ',
	            this.dm_formatP(this.props.pValue),
	            React.createElement(
	              'div',
	              { className: 'dropdown hidden-print', style: { display: 'inline', marginLeft: '0.25em' } },
	              React.createElement(
	                'button',
	                { id: 'dm.pvalue.slider', type: 'button', className: 'btn btn-primary btn-xs dropdown-toggle', 'data-toggle': 'dropdown', 'aria-haspopup': 'true', 'aria-expanded': 'false' },
	                React.createElement('span', { className: 'caret' })
	              ),
	              React.createElement(
	                'ul',
	                { className: 'dropdown-menu', 'aria-labelledby': 'dm.pvalue.slider' },
	                React.createElement(
	                  'li',
	                  null,
	                  React.createElement(
	                    'a',
	                    { href: '#' },
	                    React.createElement('input', { type: 'range', min: '0', max: '1', value: this.props.pValue, step: '0.01', onChange: this.props.pAdjuster })
	                  )
	                )
	              )
	            ),
	            React.createElement(
	              'emph',
	              null,
	              ' not'
	            ),
	            ' corrected for multiple testing; ambiguous characters resolved to minimize substitution counts.',
	            React.createElement('br', null),
	            React.createElement('i', { className: 'fa fa-exclamation-circle' }),
	            ' Please cite ',
	            React.createElement(
	              'a',
	              { href: 'http://www.ncbi.nlm.nih.gov/pubmed/15703242', target: '_blank' },
	              'PMID 15703242'
	            ),
	            ' if you use this result in a publication, presentation, or other scientific work.'
	          )
	        )
	      )
	    );
	  }
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(57), __webpack_require__(54)))

/***/ }

});
//# sourceMappingURL=app.js.map
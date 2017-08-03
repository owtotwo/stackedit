/* global window,MathJax */
var spawn = require('child_process').spawn;
var fs = require('fs');
var path = require('path');
var os = require('os');
var request = require('request');

function waitForJavaScript() {
	if(window.MathJax) {
		// Amazon EC2: fix TeX font detection
		MathJax.Hub.Register.StartupHook("HTML-CSS Jax Startup",function () {
			var HTMLCSS = MathJax.OutputJax["HTML-CSS"];
			HTMLCSS.Font.checkWebFont = function (check,font,callback) {
				if (check.time(callback)) {
					return;
				}
				if (check.total === 0) {
					HTMLCSS.Font.testFont(font);
					setTimeout(check,200);
				} else {
					callback(check.STATUS.OK);
				}
			};
		});
		MathJax.Hub.Queue(function () {
			window.status = 'done';
		});
	}
	else {
		setTimeout(function() {
			window.status = 'done';
		}, 2000);
	}
}

var authorizedPageSizes = [
	'A3',
	'A4',
	'Legal',
	'Letter'
];

exports.export = function(req, res, next) {
};

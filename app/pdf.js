var fs = require('fs');
var path = require('path');
var os = require('os');
var pdf = require('html-pdf');

exports.export = function (req, res, next) {

	function onError(err) {
		next(err);
	}
	// function onUnknownError() {
	// 	res.statusCode = 400;
	// 	res.end('Unknown error');
	// }
	function onTimeout() {
		res.statusCode = 408;
		res.end('Request timeout');
	}

	var options;
	try {
		options = JSON.parse(req.query.options);
	}
	catch (e) {
		options = {};
	}


	// Margins
	var marginTop = parseInt(options.marginTop);
	var marginRight = parseInt(options.marginRight);
	var marginBottom = parseInt(options.marginBottom);
	var marginLeft = parseInt(options.marginLeft);


	var configs = {
		"format": "A4",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid 
		"orientation": "portrait", // portrait or landscape 

		"border": {
			"top": (isNaN(marginTop) ? "30" : marginTop.toString()) + "in",            // default is 0, units: mm, cm, in, px 
			"right": (isNaN(marginRight) ? "30" : marginRight.toString()) + "in",
			"bottom": (isNaN(marginBottom) ? "30" : marginBottom.toString()) + "in",
			"left": (isNaN(marginLeft) ? "30" : marginLeft.toString()) + "in"
		},

		// File options 
		"type": "pdf",             // allowed file types: png, jpeg, pdf 
	};


	var filePath = path.join(os.tmpDir(), Date.now() + '.pdf');
	var tmpFile = fs.createWriteStream(filePath);
	var pipe = req.pipe(tmpFile);

	pipe.on('finish', function() {
		console.log("success to write the request content to temp html file: ", filePath);
		var html = fs.readFileSync(filePath, 'utf8');
		fs.unlink(filePath, function() { console.log("remove the temp html file: ", filePath); });
		pdf.create(html, configs).toStream(function (err, stream) {
			if (err) {
				onError("error in html to pdf process");
			} else {
				stream.pipe(res);
			}
		});
	});

	pipe.on('error', function() {
		onError("error to write temp file...");
	});

	pipe.on('timeout', function() {
		onTimeout();
	});
};

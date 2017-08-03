var cluster = require('cluster');
var http = require('http');
var https = require('https');
var app = require('./app');

var count = require('os').cpus().length;

if(!process.env.NO_CLUSTER && cluster.isMaster) {
	for(var i = 0; i < count; i++) {
		cluster.fork();
	}
	cluster.on('exit', function() {
		console.log('Worker died. Spawning a new process...');
		cluster.fork();
	});
}
else {
	var port = process.env.PORT || 443;
	if(port == 443) {
		// OpsWorks configuration
		var fs = require('fs');
		var credentials = {
			key: fs.readFileSync(__dirname + '/ssl/private.pem', 'utf8'),
			cert: fs.readFileSync(__dirname + '/ssl/file.crt', 'utf8'),
			ca: fs.readFileSync(__dirname + '/ssl/csr.pem', 'utf8').split('\n\n')
		};
		var httpsServer = https.createServer(credentials, app);
		httpsServer.listen(port, 'localhost', function() {
			console.log('HTTPS server started: https://localhost');
		});
		port = 3000;
	}
	var httpServer = http.createServer(app);
	httpServer.listen(port, 'localhost', function() {
		console.log('HTTP server started: http://localhost:' + port);
	});
}


var http = require('http');
var httpProxy = require('http-proxy');
var redis = require('redis');

var client = redis.createClient(6379, '127.0.0.1', {})

var proxy = httpProxy.createProxyServer({});

var server = http.createServer(function(req, res) {
	var myValue;
	client.rpoplpush("primary","secondary", function(err, value) {
		myValue = value;
		console.log("myValue is: ",myValue);
		if (typeof(myValue) == "string") {
			myValue = parseInt(myValue);
		}
		var fullUrl = 'http' + '://' + req.headers.host + ":" + myValue.toString() + req.url;
		console.log("URL: ", fullUrl);	
		if (myValue == 3000) {
			console.log("Fetching request from: ", value); 
			proxy.web(req, res, {target: 'http://localhost:3000'}, function(err, data) {
				
			});	
		} else if (myValue == 3001) {
			console.log("Fetching request from: ", value); 
			proxy.web(req, res, {target: 'http://localhost:3001'}, function(err, data) {	
			});
		}
		client.rpoplpush("secondary", "primary", function(err, value) {
			console.log("Pushed value into primary: ", value);
		});
		
	});
	
}).listen(80);

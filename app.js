// A very basic web server in node.js
// Stolen from: Node.js for Front-End Developers by Garann Means (p. 9-10) 

var port = 8080;
var serverUrl = "127.0.0.1";

var http = require("http");
var path = require("path"); 
var fs = require("fs");
var url = require("url");
var io = require('socket.io');

var validExtensions = {
		"html" : "text/html",			
		"js": "application/javascript", 
		"io": "application/javascript", 
		"css": "text/css",
		"txt": "text/plain",
		"jpg": "image/jpeg",
		"gif": "image/gif",
		"png": "image/png",
		"ico": "image/x-icon"

};



var server = http.createServer( function(req, res) {

	var now = new Date();

	var request = url.parse(req.url, true);
	var filename = request.pathname;

	if(filename == "/")
	{
		filename = "/index.html";
	}

	if(filename != "/socket.io/")
	{
		//console.log(filename);
		var exts = filename.split('.')
		var ext = exts[exts.length - 1];
		//console.log("AARGH: " + ext)

		var localPath = __dirname;

		var isValidExt = validExtensions[ext];

		if (isValidExt) {
			
			localPath += filename;
			fs.exists(localPath, function(exists) {
				if(exists) {
					//console.log("Serving file: " + localPath);
					getFile(localPath, res, ext);
				} else {
					console.log("File not found: " + localPath);
					res.writeHead(404);
					res.end();
				}
			});

		} else {
			console.log("Invalid file extension detected: " + ext)
		}
	}

})
server.listen(port, serverUrl);

var socket = io.listen(server); 

socket.on('connection', function(client){
  console.log('A NEW CHALLENGER HAS ARISEN');
	client.on('move', function(board){
		console.log(board);
		client.broadcast.emit('board', board);
	});
});


function getFile(localPath, res, mimeType) {
	fs.readFile(localPath, function(err, contents) {
		if(!err) {
			res.setHeader("Content-Length", contents.length);
			res.setHeader("Content-Type", validExtensions[mimeType]);
			res.statusCode = 200;
			res.end(contents);
		} else {
			res.writeHead(500);
			res.end();
		}
	});
}
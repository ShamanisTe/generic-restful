'use strict';

const restify = require('restify');
const fs = require('fs');
const path = require('path');
const extend = require('util')._extend;

const basePath = 'data';

let opts = {
	name: 'RESTful application'
};

if(false){
	opts.certificate = fs.readFileSync('path/to/server/certificate');
	opts.key = fs.readFileSync('path/to/server/key');
}

// Initialize restify server
const server = restify.createServer(opts);
server.use(restify.gzipResponse());
server.use(restify.queryParser());
server.use(restify.bodyParser());


const verboses = ['get', 'post', 'put', 'del'];

const routeCatcher = /^\/[a-zA-Z0-9_\.~-]+/;
// Filter to transform data
const routeFormatData = (req, res, next) => {
	console.log('---------------');

	console.log('url : ', req.url);
	console.log('method : ', req.method);

	req.filters = extend({}, req.params);
	var regex = /(\/[a-zA-Z0-9_\.~-]+)/g;
	req.params = req.url.match(regex).map(param => param.substr(1));

	console.log('Project name : ', req.params[0]);
	console.log('Resource name : ', req.params[1]);
	console.log('Get one by value : ', req.params[2]);
	console.log('Filter by : ', req.filters);

	return next();
};

const checkData = (req, res, next) => {
	console.log('--');

	// Check project name
	if(!req.params[0]){
		res.send(404, 'missing project name');
		return next();
	}

	// Check ressource name
	if(!req.params[1]){
		res.send(404, 'missing ressource name');
		return next();
	}

	req.projectPath = path.join(__dirname, basePath, req.params[0]);
	return next();
};

// Catch all verb route
for (var i = 0; i < verboses.length; i++) {
	server[verboses[i]](
		routeCatcher,
		routeFormatData,
		checkData,
		require(path.join(__dirname, 'router', verboses[i]))
	);
}

server.listen(8080);
console.log('Your serve is running on port 8080');

const config = require('./config');

const express = require('express');
const session = require('express-session');

const server = express();

server.use(express.static('public'));
server.use(session({
	saveUninitialized: false,
	secret: config.secret,
	unset: 'destroy'
}));

server.listen(config.port);

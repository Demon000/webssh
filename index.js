const Config = require('./config');

const Express = require('express');
const Session = require('express-session');

const server = Express();

server.use(Express.static('public'));

server.use(Session({
	resave: false,
	saveUninitialized: false,
	secret: Config.secret,
	unset: 'destroy'
}));

server.listen(Config.port);

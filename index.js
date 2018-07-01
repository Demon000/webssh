const Config = require('./config');

const Express = require('express');
const Session = require('express-session');
const SocketIO = require('socket.io');

const server = Express();

server.use(Express.static('public'));

const session = Session({
	resave: false,
	saveUninitialized: false,
	secret: Config.secret,
	unset: 'destroy'
});
server.use(session);

const socket = SocketIO({
	serveClient: false
});
server.use(socket);

server.listen(Config.port);

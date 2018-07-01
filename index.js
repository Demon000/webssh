const Config = require('./config');

const Http = require('http');

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

const httpServer = Http.Server(server);
const socket = SocketIO(httpServer, {
    serveClient: false
});

server.listen(Config.port);

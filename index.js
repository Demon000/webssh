const Config = require('./config');

const Http = require('http');

const Express = require('express');
const SocketIO = require('socket.io');

const server = Express();

server.use(Express.static('public'));

const httpServer = Http.Server(server);
const socket = SocketIO(httpServer, {
    serveClient: false
});

server.listen(Config.port);

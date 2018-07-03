const Config = require('./config');

const Http = require('http');

const Express = require('express');
const SocketIO = require('socket.io');
const SSHSocket = require('./SSHSocket');

const app = Express();

app.use(Express.static('public'));

const server = Http.Server(app);
const io = SocketIO(server, {
    serveClient: false
});
io.on('connect', function(socket) {
	socket.on('init-ssh', SSHSocket.bind(this, socket));
});

server.listen(Config.port);

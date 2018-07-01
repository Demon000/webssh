const Config = require('./config');

const Http = require('http');

const Express = require('express');
const SocketIO = require('socket.io');

const app = Express();

app.use(Express.static('public'));

const server = Http.Server(app);
const io = SocketIO(server, {
    serveClient: false
});

app.listen(Config.port);

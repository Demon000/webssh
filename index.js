const Config = require('./config');

const Http = require('http');

const Express = require('express');
const SocketIO = require('socket.io');
const SSHSocket = require('./SSHSocket');
const Session = require('express-session');

const app = Express();

app.use(Express.static('public'));

const session = Session({
  resave: false,
  saveUninitialized: false,
  secret: Config.secret,
  unset: 'destroy'
});
app.use(session);

const server = Http.Server(app);
const io = SocketIO(server, {
    serveClient: false
});
io.use((socket, next) => {
    session(socket.request, socket.request.res, next);
});
io.on('connect', socket => {
	socket.on('ssh:connect', SSHSocket.bind(this, socket));
});

server.listen(Config.port);

const SocketIO = require('socket.io');
const SSHSocket = require('./LimitedSSHSocket');

module.exports = function(server, session) {
	const io = SocketIO(server, {
	    serveClient: false
	});

	io.use((socket, next) => {
	    session(socket.request, socket.request.res, next);
	});

	io.on('connect', socket => {
		socket.on('ssh:connect', SSHSocket.bind(this, socket));
	});
};
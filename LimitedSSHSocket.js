const Config = require('./config');

const SSHSocket = require('./SSHSocket');

module.exports = function(socket, auth, options, isConnected) {
	const name = auth.server;
	const server = Config.servers[name];
	if (!server) {
		isConnected(false);
	}

	Object.assign(auth, server);
	SSHSocket(socket, auth, options, isConnected);
};

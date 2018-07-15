const Config = require('./config');
const SSHWrapper = require('./SSHWrapper');

function getServer(name) {
	return Config.servers[name] || {};
}

function fillAuth(auth) {
	Object.assign(auth, getServer(auth.server));
	delete auth.server;
	console.log(auth.server);
	return auth;
}

module.exports = {
	SSHConnection: (auth, options, isConnected) =>
		SSHWrapper.SSHConnection(fillAuth(auth), options, isConnected),
	SSHSocket: (socket, auth, options, isConnected) =>
		SSHWrapper.SSHSocket(socket, fillAuth(auth), options, isConnected)
};

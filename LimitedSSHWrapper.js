const Config = require('./config');
const SSHWrapper = require('./SSHWrapper');

function getServer(name) {
	return Config.servers[name] || {};
}

function fillAuth(auth) {
	Object.assign(auth, getServer(auth.server));
	return auth;
}

function SSHConnection(auth, options, isConnected) {
	SSHWrapper.SSHConnection(fillAuth(auth), options, isConnected);
}
function SSHSocket(socket, auth, options, isConnected) {
	SSHWrapper.SSHSocket(socket, fillAuth(auth), options, isConnected);
}

module.exports = {
	SSHConnection,
	SSHSocket
};

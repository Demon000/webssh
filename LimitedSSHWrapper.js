const Config = require('./config');
const SSH = require('./SSHWrapper');

function getServer(name) {
	return Config.servers[name] || {};
}

function fillAuth(auth) {
	return Object.assign(auth, getServer(auth.server));
}

function Connection(auth, options, isConnected) {
	SSH.Connection(fillAuth(auth), options, isConnected);
}
function Socket(socket, auth, options, isConnected) {
	SSH.Socket(socket, fillAuth(auth), options, isConnected);
}

module.exports = {
	Connection,
	Socket
};

const SSH = require('ssh2-promise');

function sendSocketError(socket, message) {
    socket.emit('ssh:error', message);
}

function sendSocketData(socket, data) {
    socket.emit('ssh:data', data.toString('utf-8'));
}

function bindSocketStream(socket, stream) {
    const dataFn = sendSocketData.bind(null, socket);
    stream.on('data', dataFn);
    stream.stderr.on('data', dataFn);

    socket.on('ssh:data', data => stream.write(data));
    socket.on('ssh:size', (rows, cols) => stream.setWindow(rows, cols));
}

function SSHConnection(auth, options, isConnected) {
    const connection = new SSH(auth);
    const fn = isConnected.bind(connection);

    connection.shell(options)
    .then(stream => fn(true, stream))
    .catch(err => fn(false, null));

    return connection;
}

function SSHSocket(socket, auth, options, isConnected) {
    SSHConnection(auth, options, (connected, stream) => {
        if (connected) {
            bindSocketStream(socket, stream);
        }

        connection.on('error', () => sendSocketError(socket, 'Connection error.'));
        socket.on('disconnect', () => connection.close);

        isConnected.call(this, connected);
    });
}

module.exports = {
    SSHConnection,
    SSHSocket
};

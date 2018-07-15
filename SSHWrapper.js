const SSH = require('ssh2-promise');

function SocketError(message) {
    this.emit('ssh:error', message);
}

function SocketData(data) {
    this.emit('ssh:data', data.toString('utf-8'));
}

function bindSocketStream(socket, stream) {
    const dataFn = SocketData.bind(socket);
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
    const connection = new SSHConnection(auth, options, (connected, stream) => {
        if (connected) {
            bindSocketStream(socket, stream);
        }

        isConnected.call(connection, connected);
    });

    connection.on('error', SocketError.bind(socket, 'Connection error.'));
    socket.on('disconnect', connection.close);
}

module.exports = {
    SSHConnection,
    SSHSocket
};

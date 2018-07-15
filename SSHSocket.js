const SSH = require('ssh2-promise');

function sendSocketError(socket, message) {
    socket.emit('ssh:error', message);
}

function sendSocketData(socket, data) {
    socket.emit('ssh:data', data.toString('utf-8'));
}

function bindSocketStream(socket, stream) {
    const dataFn = sendSocketData.bind(this, socket);
    stream.on('data', dataFn);
    stream.stderr.on('data', dataFn);

    socket.on('ssh:data', data => {
        stream.write(data);
    });

    socket.on('ssh:size', (rows, cols) => {
        stream.setWindow(rows, cols);
    });
}

function SSHConnection(auth, options, isConnected) {
    const connection = new SSH(auth);

    connection.shell(options)
    .then(stream => {
        isConnected(true, stream);
    })
    .catch(err => {
        isConnected(false, null);
    });

    return connection;
}

function SSHSocket(socket, auth, options, isConnected) {
    const connection = new SSHConnection(auth, options, (connected, stream) => {
        if (connected) {
            bindSocketStream(socket, stream);
        }

        isConnected(connected);
    });

    connection.on('error', err => {
        sendSocketError(socket, 'Connection error.');
    });

    socket.on('disconnect', function() {
        connection.close();
    });
}

module.exports = SSHSocket;

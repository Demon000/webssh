const SSH = require('ssh2-promise');

function SSHError(socket, message) {
    socket.emit('ssh:error', message);
}

SSHError.connectionFailed = function(socket) {
    SSHError(socket, 'Connection failed.');
}

function SSHStream(stream, socket) {
    stream.on('data', data => {
        socket.emit('data', data.toString('utf-8'));
    });

    socket.on('data', data => {
        stream.write(data);
    });

    socket.on('size', (rows, cols) => {
        stream.setWindow(rows, cols);
    });
}

function SSHSocket(socket, auth, options, isConnected) {
    let connection = new SSH(auth);

    connection.shell(options)
    .then(stream => {
        isConnected(true);
        SSHStream(stream, socket);
    })
    .catch(err => {
        isConnected(false);
    });

    connection.on('error', err => {
        SSHError.connectionFailed(socket);
    });
}

module.exports = SSHSocket;

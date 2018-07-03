const SSH = require('ssh2-promise');

function SSHError(socket, message) {
    socket.emit('ssherror', message);
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

function SSHSocket(socket, auth, options) {
    let connection = new SSH(auth);

    connection.shell(options)
    .then(stream => {
        SSHStream(stream, socket);
    })
    .catch(err => {
        SSHError.connectionFailed(socket);
    });

    connection.on('error', err => {
        SSHError.connectionFailed(socket);
    });
}

module.exports = SSHSocket;

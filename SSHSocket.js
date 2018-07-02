const SSH = require('ssh2').Client;

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

function SSHConnection(socket, auth, options) {
    let connection = new SSH();

    connection.on('ready', () => {
        connection.shell(options, (err, stream) => {
            if (err) {
                SSHError.connectionFailed(socket);
                return;
            }

            SSHStream(stream, socket);
        });
    });

    connection.on('error', err => {
        SSHError.connectionFailed(socket);
    });

    socket.on('disconnect', () => {
        connection.end();
    });

    connection.connect(auth);
}

function SSHSocket(socket) {
    socket.on('init', SSHConnection.bind(this, socket));
}

module.exports = SSHSocket;

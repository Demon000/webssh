const SSH = require('ssh2-promise');

function SSHError(socket, message) {
    socket.emit('ssh:error', message);
}

function SSHStream(stream, socket) {
    function dataFn(data) {
        socket.emit('ssh:data', data.toString('utf-8'));
    }

    stream.on('data', dataFn);
    stream.stderr.on('data', dataFn);

    socket.on('ssh:data', data => {
        stream.write(data);
    });

    socket.on('ssh:size', (rows, cols) => {
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
        SSHError(socket, 'Connection error.');
    });
}

module.exports = SSHSocket;

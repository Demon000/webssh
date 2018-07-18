const SSH = require('ssh2-promise');

function sendSocketError(socket, message) {
    socket.emit('ssh:error', message);
}

function sendSocketData(socket, data) {
    socket.emit('ssh:data', data.toString('utf-8'));
}

function bindSocketToStream(socket, stream) {
    const dataFn = sendSocketData.bind(null, socket);
    stream.on('data', dataFn);
    stream.stderr.on('data', dataFn);

    socket.on('ssh:data', function(data) {
        stream.write(data)
    });

    socket.on('ssh:size', function(rows, cols) {
        stream.setWindow(rows, cols)
    });
}

function Connection(auth, options, isConnected) {
    const connection = new SSH(auth);
    const fn = isConnected.bind(connection);

    connection.shell(options)
    .then(stream => fn(true, stream))
    .catch(err => fn(false, null));

    return connection;
}

function Socket(socket, auth, options, isConnected) {
    Connection(auth, options, function(connected, stream) {
        const connection = this;

        if (connected) {
            bindSocketToStream(socket, stream);
        }

        connection.on('error', function() {
            sendSocketError(socket, 'Connection error.');
        });

        socket.on('disconnect', function() {
            connection.close();
        });

        isConnected.call(this, connected);
    });
}

module.exports = {
    Connection,
    Socket
};

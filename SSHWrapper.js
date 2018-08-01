const SSH = require('ssh2').Client;

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
        stream.write(data);
    });

    socket.on('ssh:size', function(rows, cols) {
        stream.setWindow(rows, cols);
    });
}

function Connection(auth, options, streamFn) {
    const connection = new SSH();
    const fn = streamFn.bind(connection);

    connection
    .on('ready', function() {
        connection
        .shell(options, function(err, stream) {
            fn(stream);

            if (!stream) {
                return;
            }

            stream.on('close', function() {
                connection.end();
            });

        });
    })
    .on('error', function() {
        fn(null);
    })
    .connect(auth);
}

function Socket(socket, auth, options, streamFn) {
    Connection(auth, options, function(stream) {
        const connection = this;

        streamFn.call(connection, stream);

        if (!stream) {
            return;
        }

        bindSocketToStream(socket, stream);

        connection.on('error', function() {
            sendSocketError(socket, 'Connection error.');
        });

        socket.on('disconnect', function() {
            connection.end();
        });
    });
}

module.exports = {
    Connection,
    Socket
};

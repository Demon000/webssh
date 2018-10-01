const SSH = require('ssh2').Client;

function bindSocketToStream(socket, stream) {
    stream.on('data', socket.emitData);
    stream.stderr.on('data', socket.emitData);

    socket.on('Terminal:data', function(data) {
        stream.write(data);
    });

    socket.on('Terminal:size', function(rows, cols) {
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

function checkAuth(auth, connectedFn) {
    Connection(auth, {}, function(stream) {
        const connection = this;
        const connected = stream ? true : false;

        connection.end();

        connectedFn(connected);
    });
}

function Terminal(socket, auth, options, streamFn) {
    socket.emitData = function(data) {
        socket.emit('Terminal:data', data.toString('utf-8'));
    };

    socket.emitError = function(error) {
        socket.emit('Terminal:error', error);
    };

    Connection(auth, options, function(stream) {
        const connection = this;

        streamFn.call(connection, stream);

        if (!stream) {
            return;
        }

        bindSocketToStream(socket, stream);

        connection.on('error', function() {
            socket.emitError('Connection error.');
        });

        socket.on('disconnect', function() {
            connection.end();
        });
    });
}

module.exports = {
    apps: {
        Terminal,
    },
    checkAuth,
};

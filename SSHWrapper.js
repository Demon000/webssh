const SSH = require('ssh2').Client;

function SFTPConnection(auth, options, streamFn) {
    const connection = new SSH();
    const fn = streamFn.bind(connection);

    connection
    .on('ready', function() {
        connection
        .sftp(function(err, stream) {
            fn(stream);
        });
    })
    .on('error', function() {
        fn(null);
    })
    .connect(auth);
}

function FileExplorer(socket, auth, options, streamFn) {
    SFTPConnection(auth, options, function(stream) {
        const connection = this;

        streamFn.call(connection, stream);

        if (!stream) {
            return;
        }

        socket.on('FileExplorer:list', function(path, listFn) {
            stream.readdir(path, function(err, list) {
                listFn(list);
            });
        });
    });
}

function SSHConnection(auth, options, streamFn) {
    const connection = new SSH();
    const fn = streamFn.bind(connection);

    connection
    .on('ready', function() {
        connection
        .shell(options, function(err, stream) {
            fn(stream);
        });
    })
    .on('error', function() {
        fn(null);
    })
    .connect(auth);
}

function checkAuth(auth, successFn) {
    SSHConnection(auth, {}, function(stream) {
        const connection = this;
        const success = stream ? true : false;

        connection.end();

        successFn(success);
    });
}

function Terminal(socket, auth, options, streamFn) {
    socket.emitData = function(data) {
        socket.emit('Terminal:data', data.toString('utf-8'));
    };

    socket.emitError = function(error) {
        socket.emit('Terminal:error', error);
    };

    socket.onData = function(dataFn) {
        socket.on('Terminal:data', dataFn);
    };

    socket.onSize = function(sizeFn) {
        socket.on('Terminal:size', sizeFn);
    };

    SSHConnection(auth, options, function(stream) {
        const connection = this;

        streamFn.call(connection, stream);

        if (!stream) {
            return;
        }

        stream.on('data', socket.emitData);
        stream.stderr.on('data', socket.emitData);
        stream.on('close', function() {
            connection.end();
        });

        socket.onData(function(data) {
            stream.write(data);
        });

        socket.onSize(function(rows, cols) {
            stream.setWindow(rows, cols);
        });

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
        FileExplorer,
        Terminal,
    },
    checkAuth,
};

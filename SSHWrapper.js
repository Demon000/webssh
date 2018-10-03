const SSH = require('ssh2').Client;
const SFTPStream = require('./SFTPStreamWrapper');

function SFTPConnection(auth, options, streamFn) {
    const connection = new SSH();
    const fn = streamFn.bind(connection);

    connection
    .on('ready', function() {
        connection.sftp(fn);
    })
    .on('error', fn)
    .connect(auth);
}

function FileExplorer(socket, auth, options, streamFn) {
    SFTPConnection(auth, options, function(err, stream) {
        const connection = this;

        streamFn.call(connection, stream);

        if (!stream) {
            return;
        }

        socket.on('FileExplorer:list', function(path, dirFn) {
            SFTPStream(stream).readdir(path, dirFn);

        });
    });
}

function SSHConnection(auth, options, streamFn) {
    const connection = new SSH();
    const fn = streamFn.bind(connection);

    connection
    .on('ready', function() {
        connection.shell(options, fn);
    })
    .on('error', fn)
    .connect(auth);
}

function checkAuth(auth, successFn) {
    SSHConnection(auth, {}, function(err, stream) {
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

    SSHConnection(auth, options, function(err, stream) {
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

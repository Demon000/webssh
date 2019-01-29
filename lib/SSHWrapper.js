const SSH = require('ssh2').Client;

function Connection(credentials, successFn) {
    const connection = new SSH();
    const fn = successFn.bind(connection);

    if (!credentials) {
        fn(false);
    }

    connection.on('ready', function() {
        fn(true);
    }).on('error', function() {
        fn(false);
    }).connect(credentials);
}

function Auth(credentials, successFn) {
    Connection(credentials, function(success) {
        const connection = this;
        const fn = successFn.bind(connection);

        fn(success);

        if (!success) {
            return;
        }

        connection.end();
    });
}

function SSHConnection(credentials, options, streamFn) {
    Connection(credentials, function(success) {
        const connection = this;
        const fn = streamFn.bind(connection);

        if (!success) {
            fn(null);
            return;
        }

        connection.shell(options, function(err, stream) {
            if (err) {
                fn(null);
                return;
            }

            fn(stream); 
        });
    });
}

function Terminal(socket, credentials, options, streamFn) {
    SSHConnection(credentials, options, function(stream) {
        const connection = this;
        const fn = streamFn.bind(connection);

        fn(stream);

        if (!stream) {
            return;
        }

        connection.on('error', function() {
            socket.emit('err');
        });
    
        stream.on('close', function() {
            connection.end();
            socket.disconnect();
        });
    
        socket.on('disconnect', function() {
            connection.end();
            stream.end();
        });

        stream.on('data', function(data) {
            socket.emit('data', data.toString('utf-8'));
        });
    
        stream.stderr.on('data', function(data) {
            socket.emit('data', data.toString('utf-8'));
        });
    
        socket.on('data', function(data) {
            stream.write(data);
        });
    
        socket.on('size', function(rows, cols) {
            stream.setWindow(rows, cols);
        });
    });
}

module.exports = {
    Auth,
    Terminal,
};

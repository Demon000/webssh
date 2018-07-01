const SSH = require('ssh2').Client;

function SSHStream(stream, socket) {
    stream.on('data', data => {
        socket.emit('data', data.toString('utf-8'));
    });

    socket.on('data', data => {
        stream.write(data);
    });

    socket.on('resize', options => {
        stream.setWindow(options.rows, options.cols);
    });
}

function SSHConnection(socket, options, auth) {
    let connection = new SSH();

    connection.on('ready', () => {
        connection.shell(options, (err, stream) => {
            if (err) {
                throw err;
            }

            SSHStream(stream, socket);
        });
    });

    socket.on('disconnect', () => {
        connection.end();
    });

    connection.connect(auth);
}

function SSHSocket(socket) {
    socket.on('init', (options, auth) => {
        SSHConnection(socket, options, auth);
    });
}

module.exports = SSHSocket;

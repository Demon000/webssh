const uniqid = require('uniqid');

const { SSHConnection } = require('./SSH');

class Terminal extends SSHConnection {
    constructor(...args) {
        super(...args);

        this.id = uniqid();
    }

    attach(socket) {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }

        socket.on('disconnect', () => {
            this.timeout = setTimeout(this.close, 5 * 60 * 1000);
        });

        this.connection.on('error', () => {
            socket.emit('err');
        });
    
        this.stream.on('close', () => {
            this.connection.end();
            socket.disconnect();
        });

        this.stream.on('data', (data) => {
            socket.emit('data', data.toString('utf-8'));
        });

        this.stream.stderr.on('data', (data) => {
            socket.emit('data', data.toString('utf-8'));
        });

        socket.on('data', (data) => {
            this.stream.write(data);
        });

        socket.on('size', (rows, cols) => {
            this.stream.setWindow(rows, cols);
        });
    }
}

module.exports = {
    Terminal,
};

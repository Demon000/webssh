const { Connection } = require('./SSH');

class Terminal extends Connection {
    use(socket) {
        this.connection.on('error', () => {
            socket.emit('err');
        });
    
        this.stream.on('close', () => {
            this.connection.end();
            socket.disconnect();
        });
    
        socket.on('disconnect', () => {
            this.connection.end();
            this.stream.end();
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

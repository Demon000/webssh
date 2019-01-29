const SSH = require('ssh2').Client;

class Connection {
    constructor() {
        this.connection = new SSH();
    }

    connect(credentials) {
        return new Promise((resolve, reject) => {
            if (!credentials) {
                reject(new Error('credentials-empty'));
                return;
            }
    
            this.connection.on('ready', function() {
                resolve();
            }).on('error', function(err) {
                reject(err);
            }).connect(credentials);
        });
    }

    shell(options) {
        return new Promise((resolve, reject) => {
            this.connection.shell(options, (err, stream) => {
                if (err) {
                    reject(err);
                } else {
                    this.stream = stream;
                    resolve(stream); 
                }

            });
        });
    }

    end() {
        this.connection.end();
    }
}

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
    Connection,
    Terminal,
};

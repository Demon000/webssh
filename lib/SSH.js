const SSH = require('ssh2').Client;

class Connection {
    constructor() {
        this.connection = new SSH();
        this.connected = false;
    }

    connect(credentials) {
        return new Promise((resolve, reject) => {
            this.connection.on('ready', function() {
                this.credentials = credentials;
                this.connected = true;
                resolve();
            }).on('error', function(err) {
                reject(err);
            }).connect(credentials);
        });
    }

    close() {
        if (this.connected) {
            this.connection.end();
        }

        this.closed = true;
    }
}

class SSHConnection extends Connection {
    shell(options) {
        return new Promise((resolve, reject) => {
            this.connection.shell(options, (err, stream) => {
                if (err) {
                    reject(err);
                    return;
                }

                this.stream = stream;
                resolve(stream);
            });
        });
    }

    close() {
        if (this.connected) {
            this.connection.end();
        }

        if (this.stream) {
            this.stream.end();
        }

        this.closed = true;
    }
}

module.exports = {
    Connection,
    SSHConnection,
};

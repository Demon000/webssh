const SSH = require('ssh2').Client;

class Connection {
    constructor() {
        this.connection = new SSH();
    }

    connect(credentials) {
        return new Promise((resolve, reject) => {
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

module.exports = {
    Connection,
};

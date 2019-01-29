const SSH = require('../lib/SSHWrapper');

function terminal(namespace) {
    namespace.on('connection', function(socket) {
        socket.on('init', function(options, successFn) {
            const credentials = socket.request.session.credentials;
            SSH.Terminal(socket, credentials, options, function(stream) {
                const success = stream ? true : false;
                successFn(success);
            });
        });
    });
}

module.exports = terminal;

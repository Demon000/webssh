const SSH = require('../lib/SSHWrapper');

function hasCredentials(req) {
    const credentials = req.session.credentials;
    if (!credentials || !credentials.host) {
        return false;
    }

    return true;
}

function terminal(namespace) {
    namespace.use(function(socket, next) {
        if (!hasCredentials(socket.request)) {
            next(new Error('credentials-missing'));
        }

        next();
    });

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

const SSH = require('../lib/SSHWrapper');

function terminal(namespace) {
    namespace.on('connection', function(socket) {
        socket.on('init', async function(options, successFn) {
            const credentials = socket.request.session.credentials;
            const terminal = new SSH.Terminal();
            await terminal.connect(credentials);
            await terminal.shell(options);
            terminal.use(socket);
            successFn(true);
        });
    });
}

module.exports = terminal;

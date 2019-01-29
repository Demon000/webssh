const SSH = require('../lib/SSHWrapper');

function terminal(namespace) {
    namespace.on('connection', (socket) => {
        const credentials = socket.request.session.credentials;
        if (!credentials) {
            socket.disconnect();
        }

        socket.on('init', async (options, successFn) => {
            const terminal = new SSH.Terminal();
            await terminal.connect(credentials);
            await terminal.shell(options);
            terminal.use(socket);
            successFn(true);
        });
    });
}

module.exports = terminal;

const { Terminal } = require('../lib/Terminal');

function terminal(namespace) {
    namespace.on('connection', (socket) => {
        const credentials = socket.request.session.credentials;
        if (!credentials) {
            socket.disconnect();
        }

        socket.on('init', async (options, successFn) => {
            const terminal = new Terminal();
            try {
                await terminal.connect(credentials);
                await terminal.shell(options);
            } catch (err) {
                successFn(false);
                return;
            }

            terminal.use(socket);
            successFn(true);
        });
    });
}

module.exports = terminal;

const SSH = require('../lib/SSH');

function terminal(namespace) {
    namespace.on('connection', (socket) => {
        const credentials = socket.request.session.credentials;
        if (!credentials) {
            socket.disconnect();
        }

        socket.on('init', async (options, successFn) => {
            const terminal = new SSH.Terminal();
            try {
                await terminal.connect(credentials);
            } catch (err) {
                successFn(false);
                return;
            }

            await terminal.shell(options);
            terminal.use(socket);
            successFn(true);
        });
    });
}

module.exports = terminal;

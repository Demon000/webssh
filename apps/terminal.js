const { Terminal } = require('../lib/Terminal');
const { TerminalManager } = require('../lib/TerminalManager');

function terminal(namespace) {
    const manager = new TerminalManager();

    namespace.on('connection', (socket) => {
        const credentials = socket.request.session.credentials;
        if (!credentials) {
            socket.disconnect();
        }

        socket.on('init-terminal', async (options, ack) => {
            const terminal = new Terminal();
            try {
                await terminal.connect(credentials);
                await terminal.shell(options);
            } catch (err) {
                ack(false);
                return;
            }

            manager.add(terminal);

            ack(terminal.id);
        });

        socket.on('attach-socket', (id, ack) => {
            const terminal = manager.get(id);
            if (terminal) {
                terminal.attach(socket);
                ack(true);
            } else {
                ack(false);
            }
        });
    });
}

module.exports = terminal;

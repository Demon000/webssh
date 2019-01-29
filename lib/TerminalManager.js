class TerminalManager {
    constructor() {
        this.terminals = {};
    }

    add(terminal) {
        this.terminals[terminal.id] = terminal;
    }

    get(id) {
        const terminal = this.terminals[id];
        if (!terminal || terminal.closed) {
            return null;
        }

        return terminal;
    }
}

module.exports = {
    TerminalManager,
};

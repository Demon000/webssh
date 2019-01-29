class TerminalManager {
    constructor() {
        this.terminals = {};
    }

    add(terminal) {
        this.terminals[terminal.id] = terminal;
    }

    get(id) {
        return this.terminals[id];
    }
}

module.exports = {
    TerminalManager,
};

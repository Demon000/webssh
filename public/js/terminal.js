(function() {
    var terminalContainer = document.querySelector('#terminal');
    var terminal = new SSHTerminal(terminalContainer);
    terminal.setOption('theme', {
        background: '#242424'
    });

    function setConnectionStatus(status) {
        var connectionStatus = document.querySelector('#status');
        if (status) {
            connectionStatus.classList.add('connected');
        } else {
            connectionStatus.classList.remove('connected');
        }
    }

    terminal.emitter.on('connect', function() {
        terminal.init();
    });

    terminal.emitter.on('init', function() {
        terminal.attach();
        setConnectionStatus(true);
    });

    terminal.emitter.on('disconnect', function() {
        setConnectionStatus(false);
    });
})();

(function() {
    var terminalContainer = document.querySelector('#terminal');
    var terminal = new SSHTerminal(terminalContainer);
    terminal.setOption('theme', {
        background: '#242424'
    });

    function setConnectionStatus(status) {
        var connectionStatus = document.querySelector('#status');
        switch (status) {
            case 'connect':
                connectionStatus.classList.add('connected');
                break;
            case 'disconnect':
                connectionStatus.classList.remove('connected');
                break;
        }
    }

    terminal.emitter.on('connect', function() {
        setConnectionStatus('connect');
    });

    terminal.emitter.on('disconnect', function() {
        setConnectionStatus('disconnect');
    });
})();

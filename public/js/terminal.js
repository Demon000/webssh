function setConnectionStatus(status) {
    var statusContainer = document.querySelector('#status');
    var statusText = document.querySelector('#status-text');
    switch (status) {
    case 'connecting':
        statusContainer.classList.remove('error');
        statusContainer.classList.add('visible');
        statusText.innerHTML = 'Connecting... please wait.';
        break;
    case 'connected':
        statusContainer.classList.remove('visible');
        break;
    case 'disconnected':
        statusContainer.classList.add('error');
        statusContainer.classList.add('visible');
        statusText.innerHTML = 'Connection timed out!';
    break;
    }
}

(function() {
    var terminalContainer = document.querySelector('#terminal');
    var terminal = new SSHTerminal(terminalContainer);

    terminal.emitter.on('connect', function() {
        terminal.init();
    });

    terminal.emitter.on('init', function() {
        terminal.attach();
    });

    terminal.emitter.on('attach', function() {
        terminal.setOption('theme', {
            background: '#242424'
        });
        terminal.focus();
        setConnectionStatus('connected');
    });

    terminal.emitter.on('disconnect', function() {
        setConnectionStatus('disconnected');
    });

    setConnectionStatus('connecting');
})();

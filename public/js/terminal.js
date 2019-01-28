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
        statusText.innerHTML = 'Disconnected. Trying to reconnect...';
        break;
    }
}

(function() {
    var container = document.querySelector('#terminal');
    var terminal = new SSHTerminal(container, {
        fontFamily: 'Roboto Mono',
        fontSize: 14,
        theme: {
            background: '#242424',
        },
    });

    terminal.on('connect', function() {
        terminal.init();
    });

    terminal.on('init', function() {
        terminal.attach();
    });

    terminal.on('attach', function() {
        terminal.focus();
        setConnectionStatus('connected');
    });

    terminal.on('reconnect', function() {
         setConnectionStatus('connected');
    });

    terminal.on('disconnect', function() {
        setConnectionStatus('disconnected');
    });

    setConnectionStatus('connecting');
})();

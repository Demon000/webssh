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
        term: 'xterm-256color',
        theme: {
            background: '#242424',
        },
    });


    terminal.on('attach', function() {
        setConnectionStatus('connected');
    });

    terminal.on('disconnect', function() {
        setConnectionStatus('disconnected');
    });

    setConnectionStatus('connecting');
})();

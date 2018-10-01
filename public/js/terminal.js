(function() {
    var handleActivity = false;
    function setActivity(status) {
        if (!handleActivity) {
            return;
        }

        var favicon = document.querySelector('#favicon');
        if (status) {
            favicon.href = '/assets/activity.png';
        } else {
            favicon.href = '';
        }
    }

    function handleVisibilityChange() {
        if (document.hidden) {
            handleActivity = true;
        } else  {
            setActivity(false);
            handleActivity = false;
        }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);

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

    terminal.emitter.on('activity', setActivity);

    terminal.emitter.on('connect', function() {
        setConnectionStatus('connect');
    });

    terminal.emitter.on('disconnect', function() {
        setConnectionStatus('disconnect');
    });
})();

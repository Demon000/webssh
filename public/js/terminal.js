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
    var terminal = new SSHTerminal(null, terminalContainer);
    terminal.setOption('theme', {
        background: '#242424'
    });

    terminal.emitter.on('activity', setActivity);
})();

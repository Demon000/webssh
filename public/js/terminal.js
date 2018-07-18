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
})();

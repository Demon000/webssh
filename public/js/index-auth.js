(function() {
    function doLogout() {
        var socket = io();
        socket.emit('main:deauth');
        location.reload();
    }

    var logoutButton = document.querySelector('#logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', doLogout);
    }
})();

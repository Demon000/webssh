(function() {
    function doLogout() {
        var sshAuth = new SSHAuth();
        sshAuth.deauth();
        location.reload();
    }

    var logoutButton = document.querySelector('#logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', doLogout);
    }
})();

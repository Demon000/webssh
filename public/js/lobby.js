(function() {
    function doLogout() {
        SSHAuth.logout(function(success) {
            if (success) {
                location.reload();
            }
        });
    }

    var logoutButton = document.querySelector('#logout');
    logoutButton.addEventListener('click', doLogout);
})();
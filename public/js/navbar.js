(function() {
    function doLogout(e) {
        e.preventDefault();

        SSHAuth.logout(function(success) {
            if (success) {
                location.reload();
            }
        });
    }

    var navbarLogoutButton = document.querySelector('#navbar-logout');
    navbarLogoutButton.addEventListener('click', doLogout);
})();

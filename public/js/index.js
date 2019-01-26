(function() {
    function setAvailableFields(state) {
        var passwordFields = document.querySelector('#password-fields');
        var privateKeyFields = document.querySelector('#private-key-fields');

        switch (state) {
        case 'password':
            passwordFields.classList.add('visible');
            privateKeyFields.classList.remove('visible');
            break;
        case 'key':
            passwordFields.classList.remove('visible');
            privateKeyFields.classList.add('visible');
            break;
        }
    }

    var usePrivateKeyInput = document.querySelector('#use-private-key');
    usePrivateKeyInput.addEventListener('change', function(event) {
        var state = usePrivateKeyInput.checked ? 'key' : 'password';
        setAvailableFields(state);
    });
    usePrivateKeyInput.checked = false;

    function setNotes(state) {
        var progressNote = document.querySelector('#progress-note');
        var errorNote  = document.querySelector('#error-note');
        switch(state) {
        case 'progress':
            progressNote.classList.add('visible');
            errorNote.classList.remove('visible');
            break;
        case 'error':
            progressNote.classList.remove('visible');
            errorNote.classList.add('visible');
            break;
        default:
            progressNote.classList.remove('visible');
            errorNote.classList.remove('visible');
            break;
        }
    }

    function doLogin() {
        var serverInput = document.querySelector('#server');
        var usernameInput = document.querySelector('#username');
        var passwordInput = document.querySelector('#password');
        var passphraseInput = document.querySelector('#passphrase');
        var privateKeyInput = document.querySelector('#private-key');

        var credentials = {
            server: serverInput.value,
            username: usernameInput.value
        };

        if (usePrivateKeyInput.checked) {
            credentials.passphrase = passphraseInput.value;
            credentials.privateKey = privateKeyInput.value;
        } else {
            credentials.password = passwordInput.value;
        }

        setNotes('progress');

        SSHAuth.login(credentials, function(success) {
            if (success) {
                location.reload();
                setNotes();
            } else {
                setNotes('error');
            }
        });
    }

    var connectButton = document.querySelector('#connect');
    connectButton.addEventListener('click', doLogin);

    window.addEventListener('keypress', function(event) {
        if (event.key == 'Enter') {
            doLogin();
        }
    });
})();

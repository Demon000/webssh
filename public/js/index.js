(function() {
    var usePrivateKeyInput = document.querySelector('#use-private-key');

    function usePrivateKey() {
        return usePrivateKeyInput.checked;
    }

    function updateAvailableFields() {
        var passwordFields = document.querySelector('#password-fields');
        var privateKeyFields = document.querySelector('#private-key-fields');

        if (usePrivateKey()) {
            passwordFields.classList.remove('visible');
            privateKeyFields.classList.add('visible');
        } else {
            passwordFields.classList.add('visible');
            privateKeyFields.classList.remove('visible');
        }
    }

    usePrivateKeyInput.addEventListener('change', updateAvailableFields);
    updateAvailableFields();

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

    function doAuth() {
        var serverInput = document.querySelector('#server');
        var usernameInput = document.querySelector('#username');
        var passwordInput = document.querySelector('#password');
        var passphraseInput = document.querySelector('#passphrase');
        var privateKeyInput = document.querySelector('#private-key');

        var auth = {
            server: serverInput.value,
            username: usernameInput.value
        };

        if (usePrivateKey()) {
            auth.passphrase = passphraseInput.value;
            auth.privateKey = privateKeyInput.value;
        } else {
            auth.password = passwordInput.value;
        }

        setNotes('progress');

        var socket = io();
        socket.emit('main:auth', auth, function(success) {
            if (success) {
                location.reload();
                setNotes();
            } else {
                setNotes('error');
            }
        });
    }

    var connectButton = document.querySelector('#connect');
    if (connectButton) {
        connectButton.addEventListener('click', doAuth);
    }
})();

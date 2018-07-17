var serverInput = document.querySelector('#server');
var usernameInput = document.querySelector('#username');
var passwordInput = document.querySelector('#password');
var connectButton = document.querySelector('#connect');

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
    var auth = {
        server: serverInput.value,
        username: usernameInput.value,
        password: passwordInput.value
    };

    setNotes('progress');

    superagent
    .post('/auth')
    .send(auth)
    .then(function(response) {
        var data = response.body;
        if (data.success) {
            location.reload();
            setNotes();
        } else {
            setNotes('error');
        }
    });
}

connectButton.addEventListener('click', doAuth);

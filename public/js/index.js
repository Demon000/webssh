var serverInput = document.querySelector('#server');
var usernameInput = document.querySelector('#username');
var passwordInput = document.querySelector('#password');
var connectButton = document.querySelector('#connect');

connectButton.addEventListener('click', function() {
    var auth = {
        server: serverInput.value,
        username: usernameInput.value,
        password: passwordInput.value
    };

    superagent
    .post('/auth')
    .send(auth)
    .then(function(response) {
        console.log(response.body);
    });
});

var serverInput = document.querySelector('#server');
var usernameInput = document.querySelector('#username');
var passwordInput = document.querySelector('#password');
var connectButton = document.querySelector('#connect');

connectButton.addEventListener('click', function() {
    var terminal = new SSHLogin({
        server: serverInput.value,
        username: usernameInput.value,
        password: passwordInput.value
    }, function(connected) {
        console.log(connected);
    });
});

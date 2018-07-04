var hostInput = document.querySelector('#host');
var portInput = document.querySelector('#port');
var usernameInput = document.querySelector('#username');
var passwordInput = document.querySelector('#password');
var connectButton = document.querySelector('#connect');
var container = document.querySelector('#terminal');

connectButton.addEventListener('click', function() {
    var terminal = new SSHTerminal({
        host: hostInput.value,
        port: portInput.value,
        username: usernameInput.value,
        password: passwordInput.value
    });
    terminal.attach(container);
});

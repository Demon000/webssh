var hostInput = document.querySelector('#host');
var portInput = document.querySelector('#port');
var usernameInput = document.querySelector('#username');
var passwordInput = document.querySelector('#password');
var connectButton = document.querySelector('#connect');
var container = document.querySelector('#terminal');

Terminal.applyAddon(fit);

function SSHTerminal(container, auth) {
    var xterm = new Terminal();
    var socket = io();

    socket.on('connect', function() {
        var options = {
            rows: xterm.rows,
            cols: xterm.cols,
            term: 'xterm-256color',
        };

        socket.emit('init', options, auth);
    });

    xterm.on('data', function(data) {
        socket.emit('data', data);
    });

    socket.on('data', function(data) {
        xterm.write(data);
    });

    xterm.open(container);
    xterm.fit();

    window.addEventListener('resize', function() {
        xterm.fit();
        socket.emit('resize', {
            cols: xterm.cols,
            rows: xterm.rows
        });
    });
}

connectButton.addEventListener('click', function() {
    SSHTerminal(container, {
        host: hostInput.value,
        port: portInput.value,
        username: usernameInput.value,
        password: passwordInput.value
    });
});

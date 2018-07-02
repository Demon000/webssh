var hostInput = document.querySelector('#host');
var portInput = document.querySelector('#port');
var usernameInput = document.querySelector('#username');
var passwordInput = document.querySelector('#password');
var connectButton = document.querySelector('#connect');
var container = document.querySelector('#terminal');

Terminal.applyAddon(fit);

function SSHTerminal(auth) {
    var t = this;
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

    t.fit = function() {
        xterm.fit();
        socket.emit('size', xterm.rows, xterm.cols);
    };

    t.attach = function(element) {
        xterm.open(element);
        t.fit();
    };

    window.addEventListener('resize', function() {
        t.fit();
    });
}

connectButton.addEventListener('click', function() {
    var terminal = new SSHTerminal({
        host: hostInput.value,
        port: portInput.value,
        username: usernameInput.value,
        password: passwordInput.value
    });
    terminal.attach(container);
});

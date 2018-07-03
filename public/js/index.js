var hostInput = document.querySelector('#host');
var portInput = document.querySelector('#port');
var usernameInput = document.querySelector('#username');
var passwordInput = document.querySelector('#password');
var connectButton = document.querySelector('#connect');
var container = document.querySelector('#terminal');

Terminal.applyAddon(fit);

function SSHTerminal(auth) {
    var t = this;
    var xterm = new Terminal({
        fontFamily: '"Roboto Mono"',
        fontSize: 14
    });
    var socket = io();

    socket.on('connect', function() {
        socket.emit('init-ssh', auth, {
            term: 'xterm-256color',
        });
        t.syncSize();
    });

    xterm.on('data', function(data) {
        socket.emit('data', data);
    });

    socket.on('data', function(data) {
        xterm.write(data);
    });

    socket.on('ssherror', function(message) {
        console.error(message);
    });

    t.syncSize = function() {
        socket.emit('size', xterm.rows, xterm.cols);
    };

    t.fit = function() {
        xterm.fit();
        t.syncSize();
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

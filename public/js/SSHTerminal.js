Terminal.applyAddon(fit);

function SSHTerminal(auth) {
    var t = this;

    var socket = io();

    var xterm = new Terminal({
        fontFamily: '"Roboto Mono"',
        fontSize: 14
    });

    var options = {
        term: 'xterm-256color'
    };

    t.emitter = new EventEmitter();

    function resize() {
        xterm.fit();
        socket.emit('ssh:size', xterm.rows, xterm.cols);
        t.emitter.emit('resize');
    }

    t.attach = function(element) {
        xterm.open(element);
        resize();
        t.emitter.emit('attach');
    };

    t.destroy = function() {
        xterm.dispose();
        socket.disconnect();
        t.emitter.emit('destroy');
    };

    t.connect = function(auth) {
        socket.emit('ssh:connect', auth, options, function(success) {
            t.emitter.emit('connect', success);
        });
    };

    socket.on('connect', function() {
        t.connect(auth);
    });

    xterm.on('data', function(data) {
        socket.emit('ssh:data', data);
    });

    socket.on('ssh:data', function(data) {
        xterm.write(data);
        t.emitter.emit('activity', true);
    });

    socket.on('ssh:error', function(message) {
        t.emitter.emit('error', message);
    });

    window.addEventListener('resize', resize);
}

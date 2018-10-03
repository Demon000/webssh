Terminal.applyAddon(TerminalFontLoader);
Terminal.applyAddon(fit);

function SSHTerminal(container) {
    var t = this;

    var socket = io();
    var firstConnect = true;

    var xterm = new Terminal({
        fontFamily: 'Roboto Mono',
        fontSize: 14
    });

    var options = {
        term: 'xterm-256color'
    };

    t.emitter = new EventEmitter();

    function resize() {
        xterm.fit();
        socket.emit('Terminal:size', xterm.rows, xterm.cols);
        t.emitter.emit('resize');
    }

    t.attach = function(container) {
        xterm
        .loadWebfontAndOpen(container)
        .then(function() {
            resize();
            t.emitter.emit('attach');
        });
    };

    t.destroy = function() {
        xterm.dispose();
        socket.disconnect();
        t.emitter.emit('destroy');
    };

    t.init = function() {
        socket.emit('main:init', 'Terminal', options, function(success) {
            if (success) {
                t.attach(container);
            }

            t.emitter.emit('init', success);
        });
    };

    t.setOption = function(key, value) {
        xterm.setOption(key, value);
    };

    socket.on('connect', function() {
        t.emitter.emit('connect');
    });

    socket.on('disconnect', function() {
        t.emitter.emit('disconnect');
    });

    xterm.on('data', function(data) {
        socket.emit('Terminal:data', data);
    });

    socket.on('Terminal:data', function(data) {
        xterm.write(data);
        t.emitter.emit('activity', true);
    });

    socket.on('Terminal:error', function(message) {
        t.emitter.emit('error', message);
    });

    window.addEventListener('resize', resize);
}

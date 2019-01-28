Terminal.applyAddon(TerminalFontLoader);
Terminal.applyAddon(fit);

function SSHTerminal(container, options) {
    var t = this;
    var socket = io();

    var xterm = new Terminal(options);

    var emitter = new EventEmitter();
    t.on = emitter.on.bind(emitter);
    t.emit = emitter.emit.bind(emitter);

    function resize() {
        xterm.fit();
        socket.emit('Terminal:size', xterm.rows, xterm.cols);
        t.emit('resize');
    }

    t.attach = function() {
        xterm
        .loadWebfontAndOpen(container)
        .then(function() {
            resize();
            t.emit('attach');
        });
    };

    t.focus = function() {
        xterm.focus();
    };

    t.init = function() {
        socket.emit('main:init', 'Terminal', options, function(success) {
            if (!success) {
                return;
            }

            t.emit('init', success);
            t.attach();
        });
    };

    var firstConnect = true;
    socket.on('connect', function() {
        if (firstConnect) {
            firstConnect = false;
            t.emit('first-connect');
            t.init();
        } else {
            t.emit('connect');
        }
    });

    socket.on('reconnect', function() {
        t.emit('reconnect');
    });

    socket.on('disconnect', function() {
        t.emit('disconnect');
    });

    xterm.on('data', function(data) {
        socket.emit('Terminal:data', data);
    });

    socket.on('Terminal:data', function(data) {
        xterm.write(data);
    });

    socket.on('Terminal:error', function(message) {
        t.emit('error', message);
    });

    var lastSelection;
    xterm.on('selection', function() {
        lastSelection = xterm.getSelection();
    });

    window.addEventListener('click', function(event) {
        if (event.button != 1) {
            return;
        }

        if (!lastSelection) {
            return;
        }

        socket.emit('Terminal:data', lastSelection);
        event.stopPropagation();
    });

    window.addEventListener('resize', resize);
}

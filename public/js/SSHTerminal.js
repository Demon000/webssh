Terminal.applyAddon(TerminalFontLoader);
Terminal.applyAddon(fit);

function SSHTerminal(container, options) {
    var t = this;
    var socket = io('/terminal');

    var xterm = new Terminal(options);
    var firstConnect = true;
    var terminalId = -1;
    var open = false;

    var emitter = new EventEmitter();
    t.on = emitter.on.bind(emitter);
    t.emit = emitter.emit.bind(emitter);

    t.focus = function() {
        xterm.focus();
    };

    function resize() {
        if (!open) {
            return;
        }

        xterm.fit();
        socket.emit('size', xterm.rows, xterm.cols);
        t.emit('resize');
    }

    function attach() {
        socket.emit('attach-socket', terminalId, function(success) {
            if (!success) {
                return;
            }

            t.emit('attach');
        });
    }

    function init() {
        socket.emit('init-terminal', options, function(id) {
            if (!id) {
                return;
            }

            terminalId = id;
            attach();
        });
    }

    t.on('connect', function() {
        init();
    });

    t.on('reconnect', function() {
        attach();
    });

    socket.on('connect', function() {
        if (firstConnect) {
            firstConnect = false;
            t.emit('connect');
        } else {
            t.emit('reconnect');
        }
    });

    socket.on('disconnect', function() {
        t.emit('disconnect');
    });

    xterm.on('data', function(data) {
        socket.emit('data', data);
    });

    socket.on('data', function(data) {
        xterm.write(data);
    });

    socket.on('err', function(message) {
        t.emit('err', message);
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

        socket.emit('data', lastSelection);
        event.stopPropagation();
    });

    window.addEventListener('resize', resize);

    xterm
    .loadWebfontAndOpen(container)
    .then(function() {
        open = true;
        t.emit('open');
        resize();
    });
}

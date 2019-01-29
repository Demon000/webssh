Terminal.applyAddon(TerminalFontLoader);
Terminal.applyAddon(fit);

function SSHTerminal(container, options) {
    var t = this;
    var socket = io('/terminal');

    var xterm = new Terminal(options);
    var firstConnect = true;
    var attached = false;

    var emitter = new EventEmitter();
    t.on = emitter.on.bind(emitter);
    t.emit = emitter.emit.bind(emitter);

    t.focus = function() {
        xterm.focus();
    };

    function resize() {
        if (!attached) {
            return;
        }

        xterm.fit();
        socket.emit('size', xterm.rows, xterm.cols);
        t.emit('resize');
    }

    function attach() {
        xterm
        .loadWebfontAndOpen(container)
        .then(function() {
            attached = true;
            t.emit('attach');
            resize();
        });
    }

    function init() {
        socket.emit('init', options, function(success) {
            if (!success) {
                return;
            }

            t.emit('init');
            attach();
        });
    }

    socket.on('connect', function() {
        if (firstConnect) {
            firstConnect = false;
            t.emit('connect');
            init();
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
}

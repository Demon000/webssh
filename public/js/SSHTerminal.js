function SSHTerminal(auth, container) {
    var t = this;

    var socket = io();

    var xterm = new Terminal({
        fontFamily: '"Roboto Mono", monospace',
        fontSize: 14
    });

    var options = {
        term: 'xterm-256color'
    };

    t.emitter = new EventEmitter();

    function fit() {
        var boundingRect = container.getBoundingClientRect();
        var rows = Math.floor(boundingRect.width / xterm._core.renderer.dimensions.actualCellWidth);
        var cols = Math.floor(boundingRect.height / xterm._core.renderer.dimensions.actualCellHeight);
        xterm.resize(rows, cols);
    }

    function resize() {
        fit();
        socket.emit('ssh:size', xterm.rows, xterm.cols);
        t.emitter.emit('resize');
    }

    t.attach = function(container) {
        xterm.open(container);
        setTimeout(function() {
            resize();
            t.emitter.emit('attach');
        }, 1000);
    };

    t.destroy = function() {
        xterm.dispose();
        socket.disconnect();
        t.emitter.emit('destroy');
    };

    t.connect = function(auth) {
        socket.emit('ssh:connect', auth, options, function(success) {
            t.attach(container);
            t.emitter.emit('connect', success);
        });
    };

    t.setOption = function(key, value) {
        xterm.setOption(key, value);
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

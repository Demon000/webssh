function SSHFileExplorer() {
    var fe = this;

    var socket = io();

    var emitter = new EventEmitter();
    fe.on = emitter.on.bind(emitter);
    fe.emit = emitter.emit.bind(emitter);

    fe.init = function() {
        socket.emit('main:init', 'FileExplorer', {}, function(success) {
            if (success) {
                fe.emit('init');
            }
        });

        return fe;
    };

    fe.list = function(path, dirFn) {
        socket.emit('FileExplorer:list', path, dirFn);
        return fe;
    };
}

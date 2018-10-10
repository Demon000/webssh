function FileExplorer() {
    var fe = this;

    var socket = io();

    fe.emitter = new EventEmitter();

    fe.init = function() {
        socket.emit('main:init', 'FileExplorer', {}, function(success) {
            if (success) {
                fe.emitter.emit('init');
            }
        });

        return fe;
    };

    fe.list = function(path, dirFn) {
        socket.emit('FileExplorer:list', path, dirFn);
        return fe;
    };
}

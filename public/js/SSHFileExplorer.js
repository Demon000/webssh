(function() {
    var socket = io();
    socket.emit('main:init', 'FileExplorer', {}, function(success) {
        socket.emit('FileExplorer:list', '/home/aicpdevs', function(list) {
            console.log(list);
        });
    });
})();

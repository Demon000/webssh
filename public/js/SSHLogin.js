function SSHLogin(auth, successFn) {
    var l = this;
    var socket = io();

    socket.on('connect', function() {
        socket.emit('ssh:connect', auth, {}, function(success) {
            socket.disconnect();
            successFn(success);
        });
    });
}

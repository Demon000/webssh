function SSHAuth() {
    var a = this;

    var socket = io();

    a.auth = function(auth, successFn) {
        socket.emit('main:auth', auth, successFn);
    };

    a.deauth = function() {
        socket.emit('main:deauth');
    };
}

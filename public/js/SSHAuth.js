var SSHAuth = {
    login: function(auth, successFn) {
        var socket = io();
        socket.emit('main:auth', auth, successFn);
    },
    logout: function(successFn) {
        var socket = io();
        socket.emit('main:deauth', successFn);
    }
};

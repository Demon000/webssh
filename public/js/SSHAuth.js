var SSHAuth = {
    login: function(credentials, successFn) {
        var socket = io();
        socket.emit('main:login', credentials, successFn);
    },
    logout: function(successFn) {
        var socket = io();
        socket.emit('main:logout', successFn);
    }
};

var requests = superagent;
var SSHAuth = {
    login: function(credentials, successFn) {
        requests
        .post('/auth/login')
        .send(credentials)
        .then(function(res) {
            successFn(res.body.success);
        });
    },
    logout: function(successFn) {
        requests
        .post('/auth/logout')
        .then(function(res) {
            successFn(res.body.success);
        });
    }
};

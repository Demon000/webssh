const path = require('path');

const Config = require('./config');

const Express = require('express');
const Server = require('http').Server;
const Session = require('express-session');
const SocketIO = require('socket.io');
const SSH = require('./SSHWrapper');

const app = Express();
const server = Server(app);

app.use(Express.static('public'));
app.use(Express.json());

app.set('view engine', 'ejs');

const session = Session(Config.session);
app.use(session);

const io = SocketIO(server, {
    serveClient: false
});

io.use(function(socket, next) {
    session(socket.request, socket.request.res, next);
});

function getServer(name) {
    return Config.servers[name] || {};
}

function fillAuth(auth) {
    return Object.assign(auth, getServer(auth.server));
}

io.on('connect', function(socket) {
    socket.on('main:auth', function(auth, successFn) {
        const session = socket.request.session;

        fillAuth(auth);

        SSH.checkAuth(auth, function(success) {
            if (success) {
                session.auth = auth;
                session.save();
            }

            successFn(success);
        });
    });

    socket.on('main:init', function(app, options, successFn) {
        const session = socket.request.session;

        if (!session.auth) {
            successFn(false);
        }

        SSH.apps[app](socket, session.auth, options, function(stream) {
            const success = stream ? true : false;
            successFn(success);
        });
    });

    socket.on('main:deauth', function(successFn) {
        const session = socket.request.session;
        session.destroy();
        successFn(true);
    });
});

function isAuthenticated(req, res, next) {
    if (req.session.auth) {
        return next();
    }

    res.redirect('/');
}

app.get('/', function(req, res) {
    res.render('index', {
        auth: req.session.auth
    });
});

app.get('/terminal', isAuthenticated, function(req, res) {
    res.render('terminal', {
        auth: req.session.auth
    });
});

app.get('/help', isAuthenticated, function(req, res) {
    res.render('help');
});

app.get('/file-explorer', isAuthenticated, function(req, res) {
    res.render('file-explorer', {
        auth: req.session.auth
    });
});

app.get('/servers', function(req, res) {
    res.json(Object.keys(Config.servers));
});

server.listen(Config.port);

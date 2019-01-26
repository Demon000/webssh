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

function fillServer(credentials) {
    return Object.assign(credentials, getServer(credentials.server));
}

io.on('connect', function(socket) {
    socket.on('main:login', function(credentials, successFn) {
        const session = socket.request.session;

        fillServer(credentials);

        SSH.checkCredentials(credentials, function(success) {
            if (success) {
                session.credentials = credentials;
                session.save();
            }

            successFn(success);
        });
    });

    socket.on('main:logout', function(successFn) {
        const session = socket.request.session;
        session.destroy();
        successFn(true);
    });

    socket.on('main:init', function(app, options, successFn) {
        const session = socket.request.session;

        if (!session.credentials) {
            successFn(false);
        }

        SSH.apps[app](socket, session.credentials, options, function(stream) {
            const success = stream ? true : false;
            successFn(success);
        });
    });
});

function isAuthenticated(req, res, next) {
    if (req.session.credentials) {
        return next();
    }

    res.redirect('/');
}

app.get('/', function(req, res) {
    res.render('index', {
        credentials: req.session.credentials
    });
});

app.get('/terminal', isAuthenticated, function(req, res) {
    res.render('terminal', {
        credentials: req.session.credentials
    });
});

app.get('/help', isAuthenticated, function(req, res) {
    res.render('help');
});

app.get('/file-explorer', isAuthenticated, function(req, res) {
    res.render('file-explorer', {
        credentials: req.session.credentials
    });
});

app.get('/servers', function(req, res) {
    res.json(Object.keys(Config.servers));
});

server.listen(Config.port);

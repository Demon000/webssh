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

const session = Session({
    resave: false,
    saveUninitialized: false,
    secret: Config.secret,
    unset: 'destroy'
});
app.use(session);

const io = SocketIO(server, {
    serveClient: false
});

io.use(function(socket, next) {
    session(socket.request, socket.request.res, next);
});

io.on('connect', function(socket) {
    socket.on('ssh:connect', function(auth, options, isConnected) {
        if (!auth) {
            auth = socket.request.session.auth;
        }

        SSH.Socket(socket, auth, options, isConnected);
    });
});

app.get('/', function(req, res) {
    res.render('index', {
        auth: req.session.auth
    });
});

app.get('/terminal', function(req, res) {
    if (req.session.auth) {
        res.render('terminal', {
            auth: req.session.auth
        });
    } else {
        res.redirect('/');
    }
});

function getServer(name) {
    return Config.servers[name] || {};
}

function fillAuth(auth) {
    return Object.assign(auth, getServer(auth.server));
}

app.post('/auth', function(req, res) {
    const auth = fillAuth(req.body);
    SSH.Connection(auth, {}, function(connected) {
        this.close();

        if (connected) {
            req.session.auth = auth;
        }

        res.json({
            success: connected
        });
    });
});

app.get('/servers', function(req, res) {
    res.json(Object.keys(Config.servers));
});

server.listen(Config.port);

const path = require('path');

const Config = require('./config');

const Express = require('express');
const Server = require('http').Server;
const Session = require('express-session');
const SocketIO = require('socket.io');
const SSH = require('./LimitedSSHWrapper');

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
    socket.on('ssh:connect', SSH.Socket.bind(this, socket));
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

app.post('/auth', function(req, res) {
    const auth = req.body;
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

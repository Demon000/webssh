const path = require('path');

const Config = require('./config');

const Express = require('express');
const Server = require('http').Server;
const Session = require('express-session');
const SocketIO = require('socket.io');
const SSHWrapper = require('./LimitedSSHWrapper');
const SSHSocket = SSHWrapper.SSHSocket;
const SSHConnection = SSHWrapper.SSHConnection;

const app = Express();
const server = Server(app);

app.use(Express.static('public'));
app.use(Express.json());

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

io.use((socket, next) => {
    session(socket.request, socket.request.res, next);
});

io.on('connect', socket => {
    socket.on('ssh:connect', SSHSocket.bind(this, socket));
});

app.route('/auth')
.get((req, res) => {
    res.sendFile(path.join(__dirname, 'public/auth.html'));
})
.post((req, res) => {
    const auth = req.body;
    SSHConnection(auth, {}, function(connected) {
        this.close();

        if (connected) {
            req.session.auth = auth;
        }

        res.json({
            success: connected
        });
    });
});

app.get('/servers', (req, res) => {
    res.json(Object.keys(Config.servers));
});

server.listen(Config.port);

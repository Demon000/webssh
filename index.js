const Config = require('./config');

const Express = require('express');
const Server = require('http').Server;
const Session = require('express-session');
const Socket = require('./socket');

const app = Express();
const server = Server(app);

app.use(Express.static('public'));

const session = Session({
    resave: false,
    saveUninitialized: false,
    secret: Config.secret,
    unset: 'destroy'
});
app.use(session);

Socket(server, session);

app.get('/servers', (req, res) => {
    res.json(Object.keys(Config.servers));
});

server.listen(Config.port);

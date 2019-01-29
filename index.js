const config = require('config');

const ExpressConfig = config.get('Express');
const Express = require('express');
const app = Express();
app.use(Express.static('public'));
app.use(Express.json());

const Session = require('express-session');
const SessionConfig = config.get('Session');
const session = Session(SessionConfig);
app.use(session);

const Server = require('http').Server;
const server = Server(app);

const SocketIO = require('socket.io');
const io = SocketIO(server, {
    serveClient: false,
});

io.use(function(socket, next) {
    session(socket.request, socket.request.res, next);
});

const terminalNamespace = io.of('/terminal');
const terminal = require('./apps/terminal');
terminal(terminalNamespace);

//const fileExplorerNamespace = io.of('/file-explorer');
//const fileExplorer = require('./apps/file-explorer');
//fileExplorer(fileExplorerNamespace);

const auth = require('./apps/auth');
app.use('/auth', auth);

app.set('view engine', 'ejs');
const web = require('./apps/web');
app.use('/', web);

server.listen(ExpressConfig.port);

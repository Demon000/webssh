const config = require('./config');

const express = require('express');
const server = express();

server.use(express.static('public'));

server.listen(config.port);

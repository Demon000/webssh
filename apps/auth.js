const config = require('config');
const Servers = config.get('Servers');

const Router = require('express').Router;
const SSH = require('../lib/SSHWrapper');

function fillServer(credentials) {
    const data = Servers[credentials.server] || {};
    return Object.assign({}, credentials, data);
}

const router = Router();

router.post('/login', async function(req, res) {
    const credentials = fillServer(req.body);
    const connection = new SSH.Connection();

    let success = true;
    try {
        await connection.connect(credentials);
    } catch (err) {
        success = false;
    }

    if (success) {
        req.session.credentials = credentials;
        req.session.save();
    }

    res.send({
        success,
    });
});

router.post('/logout', function(req, res) {
    req.session.destroy(function(err) {
        const success = err ? false : true;
        res.send({
            success,
        });
    });
});

module.exports = router;

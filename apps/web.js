const Router = require('express').Router;
const router = Router();

function hasCredentials(req) {
    const credentials = req.session.credentials;
    if (!credentials || !credentials.host) {
        return false;
    }

    return true;
}

function authorize(req, res, next) {
    if (!hasCredentials(req)) {
        res.redirect('/');
        return;
    }

    next();
}

router.get('/', function(req, res) {
    if (hasCredentials(req)) {
        res.render('lobby', {
            credentials: req.session.credentials,
        });
    } else {
        res.render('index');
    }
});

router.get('/terminal', authorize, function(req, res) {
    res.render('terminal', {
        credentials: req.session.credentials,
    });
});

router.get('/help', authorize, function(req, res) {
    res.render('help');
});

router.get('/file-explorer', authorize, function(req, res) {
    res.render('file-explorer', {
        credentials: req.session.credentials,
    });
});

module.exports = router;

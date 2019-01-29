const Router = require('express').Router;
const router = Router();

router.get('/', function(req, res) {
    if (req.session.credentials) {
        res.render('lobby', {
            credentials: req.session.credentials
        });
    } else {
        res.render('index');
    }
});

router.get('/terminal', function(req, res) {
    res.render('terminal', {
        credentials: req.session.credentials
    });
});

router.get('/help', function(req, res) {
    res.render('help');
});

router.get('/file-explorer', function(req, res) {
    res.render('file-explorer', {
        credentials: req.session.credentials
    });
});

module.exports = router;

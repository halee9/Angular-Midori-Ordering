var moment = require('moment-timezone');

var express = require('express');
var passport = require('passport');
var router = express.Router();
var app = express();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Dashboard for MIDORI' });
});

router.get('/display', function(req, res) {
    console.log("display");
    res.render('display', { title: 'Menu Display for Store Screen' });
});

router.get('/register', function(req, res) {
    console.log("register");
    res.render('register', { title: 'Register for Midori Screen' });
});



module.exports = router;

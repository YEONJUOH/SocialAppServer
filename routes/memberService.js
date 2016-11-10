var express = require('express');
var memberService = express.Router();

/* GET home page. */
memberService.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = memberService;
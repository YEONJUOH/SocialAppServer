var express = require('express');
var audioService = express.Router();

/* GET home page. */
audioService.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = audioService;


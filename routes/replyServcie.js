var express = require('express');
var replyService = express.Router();

/* GET home page. */
replyService.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = replyService;


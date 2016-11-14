var express = require('express');
var pool = require('../public/javascripts/pool.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', function(req, res, next) {

  pool.getConnection(function (err,con) {
    con.query('select * from member',function (err,result) {
      console.log(JSON.stringify(result));
      res.send(JSON.stringify(result));
      con.release();
    })
  })



});


module.exports = router;

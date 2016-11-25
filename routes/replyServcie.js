var express = require('express');
var replyService = express.Router();
var pool = require('../public/javascripts/pool.js');
var success= {result:'success'};
var fail ={result:'fail'};


/* createRply*/
replyService.post('/createRply', function(req, res, next) {
    var data = [req.body['a_id'],req.body['m_id'],req.body['content']];

    pool.getConnection(function (err,con) {
        con.query('insert into reply (a_id,m_id,content) values (?,?,?)',data,function (err,result) {
            if(!err) {

                res.header("Content-Type", "application/json; charset=utf-8");
                res.send(success);

            }else{
                console.log(err);
                res.send(fail);
            }
            con.release();
        })
    })


});




module.exports = replyService;


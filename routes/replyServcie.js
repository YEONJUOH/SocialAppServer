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

replyService.get('/deleteRply', function(req, res, next) {
    var data = req.query.r_id;

    pool.getConnection(function (err,con) {
        con.query('delete from reply where r_id = ?',data,function (err,result) {
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


replyService.get('/replyList', function(req, res, next) {
    var data = req.query.a_id;

    pool.getConnection(function (err,con) {
        con.query('select r_id, m.m_id as m_id, content from reply r, member m   where r.m_id = m.m_id and r.a_id = ?',data,function (err,result) {
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


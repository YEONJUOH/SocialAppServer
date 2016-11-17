var express = require('express');
var audioService = express.Router();
var pool = require('../public/javascripts/pool.js');
var success= {result:'success'};
var fail ={result:'fail'};


/*audio insert*/
audioService.post('/upload',function(req,res,next){

    //for audio table
    var data1 = [req.body['a_name'],req.body['a_comment'],req.body['s_id'],];
    //for upload table
    var data2 = req.body['m_id'];


    var a_id ;

    pool.getConnection(function (err,con) {
        con.query('insert into audio (a_name,a_comment,s_id) values (?,?,?)',data1,function (err,result) {
            if(!err) {
                a_id = result.insertId;
                con.query('insert into upload (a_id,m_id,ul_date) values (?,?,now())',[a_id,data2],function (err,result) {
                    if(!err) {
                        res.header("Content-Type", "application/json; charset=utf-8");
                        res.send(success);

                    }else{
                        res.header("Content-Type", "application/json; charset=utf-8");
                        res.send(fail);
                    }

                })

            }else{
                res.header("Content-Type", "application/json; charset=utf-8");
                res.send(fail);
            }
            con.release();
        })
    });
});

audioService.get('/audio_info', function(req, res, next) {

    var data = req.query.a_id;
    console.log("data"+data);

    pool.getConnection(function (err,con) {
        con.query('select * from audio where a_id =?',data,function (err,result) {
            if(!err) {
                res.header("Content-Type", "application/json; charset=utf-8");
                res.send(result[0]);
            }else{
                res.header("Content-Type", "application/json; charset=utf-8");
                res.send(fail);
                console.log(err);
            }
            con.release();
        })
    })
});

/*play_audio*/
audioService.post('/play_audio',function (req,res,next) {

    var data = [req.body['m_id'],req.body['a_id']];
     pool.getConnection(function (err,con) {
        con.query('insert into play_audio (play_date,m_id,a_id) values (now(),?,?)',data,function (err,result) {
            if(!err) {
                res.header("Content-Type", "application/json; charset=utf-8");
                res.send(success);
            }else{
                res.header("Content-Type", "application/json; charset=utf-8");
                res.send(fail);

            }
            con.release();
        })
    })

})



audioService.post('/score_audio', function(req, res, next) {

    var data = [req.body['m_id'],req.body['a_id'],req.body['score']];


    pool.getConnection(function (err,con) {
        con.query('insert into audio_score(m_id,a_id,score) values (?,?,?)',data,function (err,result) {
            if(!err) {
                res.header("Content-Type", "application/json; charset=utf-8");
                res.send(success);
            }else{
                res.header("Content-Type", "application/json; charset=utf-8");
                res.send(fail);

            }
            con.release();
        })
    })

});

audioService.get('/delete_audio', function(req, res, next) {

    var data = req.query.a_id;


    pool.getConnection(function (err,con) {
        con.beginTransaction(function (err) {
            console.log("here");

            if(err){
                console.log(err);
                throw err;
            }

            con.query('delete from audio_score where a_id = ?',data,function (err,result) {
                if(err){
                    con.rollback(function () {
                        console.log(err);
                        throw err;
                    })
                }

                console.log(result);

            })
        })
    })

});


module.exports = audioService;


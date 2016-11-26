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
        con.query('select s_loc, s.s_id as s_id, m_id, a_name,a_loc,a_comment,a_date from audio a, upload up , song s where a.s_id = s.s_id and up.a_id = a.a_id and a.a_id = ?',data,function (err,result) {
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



//트랜젹션 적용 대상 : audio_score, play_audio, reply, upload
audioService.get('/delete_audio', function(req, res, next) {

    var data = req.query.a_id;


    pool.getConnection(function (err,con) {
        con.beginTransaction(function (err) {
            console.log("here");

            if(err){
                console.log(err);
                throw err;
            }

            //audio_score
            con.query('delete from audio_score where a_id = ?',data,function (err,result) {
                if(err){
                    con.rollback(function () {
                        console.log(err);
                        throw err;
                    })
                }

                //play_audio
                con.query('delete from play_audio where a_id = ?',data,function (err,result) {

                    if(err){
                        con.rollback(function () {
                            console.log(err);
                            throw err;
                        })
                    }

                    //reply
                    con.query('delete from reply where a_id = ?',data,function (err,result) {

                        if(err){
                            con.rollback(function () {
                                console.log(err);
                                throw err;
                            })
                        }

                        //upload
                        con.query('delete from upload where a_id = ?',data,function (err,result) {

                            if(err){
                                con.rollback(function () {
                                    console.log(err);
                                    throw err;
                                })
                            }

                            con.query('delete from audio where a_id = ?',data,function (err,result) {

                                if(err){
                                    con.rollback(function () {
                                        console.log(err);
                                        throw err;
                                    })
                                }


                                con.commit(function (err) {
                                    if (err) {
                                        console.error(err);
                                        con.rollback(function () {
                                            console.error('rollback error');
                                            throw err;
                                        });
                                    }// if err
                                    res.header("Content-Type", "application/json; charset=utf-8");
                                    res.send(success);

                                    con.release();

                                });// commit

                            })
                        })

                    })
                })

            })
        })
    })

});

/*list_day*/
audioService.get('/list_day', function(req, res, next) {

    pool.getConnection(function (err,con) {
        con.query('select s_loc, up.m_id as m_id, t3.a_id as a_id, t3.score as score,nm from (select a_id, avg(score) as score, nm from (select t.a_id as a_id,ifnull(a_sc.score,0) as score, nm from (select a_id, count(*) as nm from play_audio where play_date = substring(now(),1,11) group by a_id) t left outer join audio_score a_sc on t.a_id = a_sc.a_id) t2 group by a_id) t3 , song s , upload up, audio a where t3.a_id = a.a_id and a.s_id = s.s_id and a.a_id = up.a_id order by nm desc',function (err,result) {
            if(!err) {
                res.header("Content-Type", "application/json; charset=utf-8");
                res.send(result);
            }else{
                res.header("Content-Type", "application/json; charset=utf-8");
                res.send(fail);

            }
            con.release();
        })
    })

});


/*list_week*/
audioService.get('/list_week', function(req, res, next) {

    pool.getConnection(function (err,con) {
        con.query('select s_loc, up.m_id as m_id, t3.a_id as a_id , t3.score as score, nm from (select a_id, avg(score) as score,nm from (select t.a_id as a_id, ifnull(a_sc.score,0) as score,nm  from (select pl.a_id as a_id, count(*) as nm from (SELECT substring(DATE_SUB(now(), INTERVAL(DAYOFWEEK(now()) - 1) DAY),1,11)  as d ) week_Start, play_audio pl   where play_date >= d and play_date <= DATE_ADD(d, INTERVAL 7 DAY) group by pl.a_id) t left outer join audio_score a_sc on t.a_id = a_sc.a_id) t2 group by a_id) t3, song s, upload up, audio a where t3.a_id = a.a_id and a.s_id = s.s_id and up.a_id = a.a_id order by nm desc',function (err,result) {
                if(!err) {
                res.header("Content-Type", "application/json; charset=utf-8");
                res.send(result);
            }else{
                res.header("Content-Type", "application/json; charset=utf-8");
                res.send(fail);

            }
            con.release();
        })
    })

});

/*list_mon*/
audioService.get('/list_mon', function(req, res, next) {

    pool.getConnection(function (err,con) {
        con.query('select s_loc, up.m_id as m_id, t3.a_id as a_id, t3.score as score,nm from (select a_id, avg(score) as score, nm from (select t.a_id as a_id,ifnull(a_sc.score,0) as score, nm from (select a_id, count(*) as nm from play_audio where substring(play_date,1,7) = substring(now(),1,7) group by a_id) t left outer join audio_score a_sc on t.a_id = a_sc.a_id) t2 group by a_id) t3 , song s , upload up, audio a where t3.a_id = a.a_id and a.s_id = s.s_id and a.a_id = up.a_id order by nm desc',function (err,result) {
            if(!err) {
                res.header("Content-Type", "application/json; charset=utf-8");
                res.send(result);
            }else{
                res.header("Content-Type", "application/json; charset=utf-8");
                res.send(fail);

            }
            con.release();
        })
    })

});


module.exports = audioService;


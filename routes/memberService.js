var express = require('express');
var memberService = express.Router();
var pool = require('../public/javascripts/pool.js');
var success= {result:'success'};
var fail ={result:'fail'};


/*회원 가입*/
memberService.post('/join',function(req,res,next){


  var data = [req.body['m_id'],req.body['password'],req.body['m_name']];

    pool.getConnection(function (err,con) {
        con.query('insert into member (m_id,password,m_name) values (?,?,?)',data,function (err,result) {
            if(!err) {
                res.sendStatus(200);
                res.send(JSON.stringify(success));

            }else{
                res.send(JSON.stringify(fail));
            }
            con.release();
        })
    })


})


/*로그인*/
memberService.post('/login',function(req,res,next){


    var data = [req.body['m_id'],req.body['password']];

    pool.getConnection(function (err,con) {
        con.query('select * from member where m_id =? and password =?',data,function (err,result) {
            if(!err) {
                console.log("로그인 성공");
                res.sendStatus(200);
               // res.send(JSON.stringify(success));
                //res.end();
            }else{
                res.send(JSON.stringify(fail));
              //  res.end();
            }
            con.release();
        })
    })


})

/*회원정보 수정*/
memberService.post('/update',function(req,res,next){


    var data = [req.body['m_name'],req.body['password'],req.body['m_id']];

    pool.getConnection(function (err,con) {
        con.query('update member set m_name=?,password=? where m_id =?',data,function (err,result) {
            if(!err) {
                res.send(JSON.stringify(succeess));
            }else{
                res.send(JSON.stringify(fail));
                console.log(err);
            }
            con.release();
        })
    })


})

/*회원 정보 조회*/
memberService.post('/memberInfo',function(req,res,next){


    var data = req.body['m_id'];

    pool.getConnection(function (err,con) {
        con.query('select m.m_id as m_id, m_name, count(a.a_id) as audio_nm , avg(score) as score_avg from member m,  upload a , audio_score a_sc where m.m_id = ? and m.m_id = a.m_id and a.a_id = a_sc.a_id',data,function (err,result) {
            if(!err) {
                res.send(JSON.stringify(result[0]));
            }else{
                res.send(JSON.stringify(fail));
                console.log(err);
            }
            con.release();
        })
    })


})

/**/







module.exports = memberService;
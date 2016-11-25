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

                res.header("Content-Type", "application/json; charset=utf-8");
                res.send(success);

            }else{
                res.send(fail);
            }
            con.release();
        })
    })


})


/*로그인*/
memberService.post('/login',function(req,res,next){


    var data = [req.body['m_id'],req.body['password']];

    pool.getConnection(function (err,con) {
        con.query('select count(*) as nm from member where m_id =? and password =?',data,function (err,result) {
            if(!err) {
               var nm = result[0].nm;

                if(nm>=1) {

                    res.header("Content-Type", "application/json; charset=utf-8");
                    res.send(success);
                }else{
                    res.header("Content-Type", "application/json; charset=utf-8");
                    res.send(fail);

                }
            }else{
                res.header("Content-Type", "application/json; charset=utf-8");
                res.send(fail);
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
                res.header("Content-Type", "application/json; charset=utf-8");
                res.send(success);
            }else{
                res.header("Content-Type", "application/json; charset=utf-8");
                res.send(fail);
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

/*test*/

memberService.post('/imgtest',function(req,res,next){
     console.log("imgtest");

    var data = req.body['imgFile'];

                res.header("Content-Type", "application/json; charset=utf-8");
                res.send("success");

})






module.exports = memberService;
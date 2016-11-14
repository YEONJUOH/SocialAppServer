var express = require('express');
var memberService = express.Router();
var pool = require('../public/javascripts/pool.js');
var succeess= {result:'success'};
var fail ={result:'fail'};

/* GET home page. */
memberService.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/*회원 가입*/
memberService.post('/join',function(req,res,next){


  var data = [req.body['m_id'],req.body['password'],req.body['m_name']];

    pool.getConnection(function (err,con) {
        con.query('insert into member (m_id,password,m_name) values (?,?,?)',data,function (err,result) {
            if(!err) {
                res.send(JSON.stringify(succeess));
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
                res.send(JSON.stringify(succeess));
            }else{
                res.send(JSON.stringify(fail));
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


    var data = [req.body['m_id']];

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







module.exports = memberService;
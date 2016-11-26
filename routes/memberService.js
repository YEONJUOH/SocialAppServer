var express = require('express');
var memberService = express.Router();
var pool = require('../public/javascripts/pool.js');
var formidable = require("formidable");
var fs = require("fs-extra");
var util = require('util');

var success= {result:'success'};
var fail ={result:'fail'};
var dir_path =  __dirname+"";
var imgPath = dir_path.replace("routes","img_dir")

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
     console.log("짜증"+imgPath);

    /*upload(req, res).then(function (file) {
        res.json(file);
    }, function (err) {
        res.send(500, err);
    });*/

    var form = new formidable.IncomingForm();
    var file_nm ;
    form.parse(req, function(err, fields, files) {
        file_nm = fields.m_id;

        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: files}));
    });

    form.on('end', function(fields, files) {
        /* Temporary location of our uploaded file */
        var temp_path = this.openedFiles[0].path;
        /* The file name of the uploaded file */
        var filetype = getFileType(this.openedFiles[0].name);

        var file_name = file_nm + "."+filetype;
        /* Location where we want to copy the uploaded file */
        var new_location = imgPath+"\\";

         console.log("tmp_path"+temp_path);

        fs.copy(temp_path, new_location +  file_name, function(err) {
            if (err) {
                console.error(err);
            } else {
                console.log("success!")
            }
        });
    });


})


var getFileType = function(obj){

    var pathpoint = obj.lastIndexOf('.');
    return obj.substring(pathpoint+1,obj.length);

};


module.exports = memberService;
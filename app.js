var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var fs = require("fs-extra");

var index = require('./routes/index');
var audioService = require('./routes/audioService');
var memberService= require('./routes/memberService');
var replyService = require('./routes/replyServcie');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/member',memberService);
app.use('/reply',replyService);
app.use('/audio',audioService);


// 이미지파일 호스팅 로직
app.get('/image/:name',function (req,res){
  var filename = req.params.name;
  console.log(__dirname+'/img_dir/'+filename);
  fs.exists(__dirname+'/img_dir/'+filename, function (exists) {
    if (exists) {
      fs.readFile(__dirname+'/img_dir/'+filename, function (err,data){
        res.end(data);
      });
    } else {
      res.end('file is not exists');
    }
  })
});

//오디오 호스팅
app.get('/audio/:name',function (req,res){
  var filename = req.params.name;
  console.log(__dirname+'/audio_dir/'+filename);
  fs.exists(__dirname+'/audio_dir/'+filename, function (exists) {
    if (exists) {
      fs.readFile(__dirname+'/audio_dir/'+filename, function (err,data){
        res.end(data);
      });
    } else {
      res.end('file is not exists');
    }
  })
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;

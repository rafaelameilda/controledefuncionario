var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var formidable = require('formidable');
var path = require('path');

var indexRouter = require('./routes/controle');


var app = express();

app.use(function (req, res, next) {

  req.body = {};
  
  let contentType = req.headers["content-type"];
 
  if (req.method === 'POST' && contentType.indexOf('multipart/form-data;') > -1) {
    var form = formidable.IncomingForm({
      uploadDir: path.join(__dirname, "/public/arquivos"),
      keepExtensions: true
    });

    form.parse(req, (err, fields, files)=> {
      req.body = fields;
      req.fields = fields;
      req.files = files;

      next();

    });

  } else {

    next();

  }

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

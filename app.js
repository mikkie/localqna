var express = require('express');
// var session = require('express-session');
// var MongoStore = require('connect-mongo')(session);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var conf = require('./routes/conf/conf');
var mongoose = require('./routes/util/mongodbUtil');

var index = require('./routes/index');
var users = require('./routes/users');
var community = require('./routes/controller/communityController');
var topic = require('./routes/controller/topicController');
var comment = require('./routes/controller/commentController');
var user = require('./routes/controller/userController');
var globalSetting = require('./routes/controller/globalSettingsController');
var fileUpload = require('./routes/controller/fileUploadController');

var globalSettingsService = require('./routes/service/globalSettingsService');

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

// app.use(session({
//     key: 'localqna session',
//     secret: 'super localqna secret',
//     resave: false,
//     saveUninitialized: true,
//     store: new MongoStore({mongooseConnection: mongoose.connection,clear_interval: conf.server.session_time_out}),
//     cookie: {maxAge: conf.server.session_time_out * 1000 * 24}
// }));

app.use('/', index);
app.use('/users', users);
app.use('/community',community);
app.use('/topic',topic);
app.use('/comment',comment);
app.use('/user',user);
app.use('/globalSetting',globalSetting);
app.use('/fileUpload',fileUpload);

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

//init
globalSettingsService.loadGlobalSettings();

module.exports = app;

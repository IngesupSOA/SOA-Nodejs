var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var swig = require('swig');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config.js'); // get our config file

var User = require('./models/UserDB');

var index = require('./routes/index');
var users = require('./routes/users');
var signUp = require('./routes/Security/signUp');
var authenticate = require('./routes/Security/authenticate');
var setup = require('./routes/setup');

var mongoose = require('mongoose');

var app = express();


///////////////////////////////////////
///// SWIG RENDER  ////////////////////
///////////////////////////////////////
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false);
// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });


///////////////////////////////////////
///// CONFIGURATION  //////////////////
///////////////////////////////////////
var port = process.env.PORT || 3000; // used to create, sign, and verify tokens
mongoose.connect(config.database.server, config.database.db, function(err){
  if(err) console.log(err);

  console.log("Connected to the database");
});

app.set('superSecret', config.secret); // secret variable

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
//// set up CORS resource sharing
//app.use(function(req, res, next){
//  res.header('Access-Control-Allow-Origin', '*');
//  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//  next();
//});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


///////////////////////////////////////
///// ROUTES  /////////////////////////
///////////////////////////////////////
//TODO register les routes dans un fichier spécifique à part (optimization) ?
app.use('/', index);
app.use('/users', users);
app.use('/signUp', signUp);
app.use('/authenticate', authenticate);
app.use('/setup', setup);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;

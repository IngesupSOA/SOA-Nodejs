"use strict";

var debug = require('debug')('app:' + process.pid),
    path = require("path"),
    fs = require("fs"),
    http_port = process.env.HTTP_PORT || 3000,
    https_port = process.env.HTTPS_PORT || 3443,
    mongoose_uri = process.env.MONGOOSE_URI || "mongodb://root:root@ds057934.mongolab.com:57934/pizzanoscope",
    onFinished = require('on-finished'),
    NotFoundError = require(path.join(__dirname, "errors", "NotFoundError.js")),
    users = require('./routes/users'),
    signUp = require('./routes/signUp'),
    pizza = require('./routes/pizza');


console.log("Starting application");

console.log("Loading Mongoose functionality");
var mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.connect(mongoose_uri);
mongoose.connection.on('error', function () {
  console.log('Mongoose connection error');
});
mongoose.connection.once('open', function callback() {
  console.log("Mongoose connected to the database");
});

console.log("Initializing express");
var express = require('express'), app = express();

console.log("Initializing Swig");
var swig = require('swig');

// This is where all the magic happens!
app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view cache', false);
swig.setDefaults({ cache: false });

console.log("Attaching plugins");
app.use(require('morgan')("dev"));
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('compression')());
app.use(require('response-time')());

app.use(function (req, res, next) {

  onFinished(res, function (err) {
    console.log("[%s] finished request", req.connection.remoteAddress);
  });

  next();

});

//ROUTING
app.use("/api", require(path.join(__dirname, "routes", "default.js"))());
app.use("/api/users", users);
app.use("/api/signUp", signUp);
app.use('/api/pizza', pizza);

// all other requests redirect to 404
app.all("*", function (req, res, next) {
  next(new NotFoundError("404"));
});

// error handler for all the applications
app.use(function (err, req, res, next) {

  var errorType = typeof err,
      code = 500,
      msg = { message: "Internal Server Error" };

  switch (err.name) {
    case "UnauthorizedError":
      code = err.status;
      msg = undefined;
      break;
    case "BadRequestError":
    case "UnauthorizedAccessError":
    case "NotFoundError":
      code = err.status;
      msg = err.inner;
      break;
    default:
      break;
  }

  return res.status(code).json(msg);

});

console.log("Creating HTTP server on port: %s", http_port);
require('http').createServer(app).listen(http_port, function () {
  console.log("HTTP Server listening on port: %s, in %s mode", http_port, app.get('env'));
});

console.log("Creating HTTPS server on port: %s", https_port);
require('https').createServer({
  key: fs.readFileSync(path.join(__dirname, "keys", "ia.key")),
  cert: fs.readFileSync(path.join(__dirname, "keys", "ia.crt")),
  ca: fs.readFileSync(path.join(__dirname, "keys", "ca.crt")),
  requestCert: true,
  rejectUnauthorized: false
}, app).listen(https_port, function () {
  console.log("HTTPS Server listening on port: %s, in %s mode", https_port, app.get('env'));
});
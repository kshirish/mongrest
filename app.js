var express = require('express');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var auth = require('./routes/authentication');
var configDb = require('./config/database.js');

var port = 3000;
var restBaseUrl = '/' + (configDb.urlPrefix || '');
var app = express();

// middlewares
app.use(logger('dev'));
app.use(session({ secret: 'nowyouseeme' }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routes
app.use('/auth', auth);
app.use(restBaseUrl, routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({ data: 'Some error occurred.', error: true });
});

// listenting to port
app.listen(port);

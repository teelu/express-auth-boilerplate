var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var pry = require('pryjs');

var app = express();

var auth = require('./helpers/auth');

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//auth check
app.use(function(req, res, next) {
  //Check if routes need auth
  var unprotected = [
    '/api/login',
    '/'
  ]
  //Skip if next
  if (unprotected.indexOf(req.originalUrl) !== -1)  return next()

  //Verify using authorization header
  var token = req.get('Authorization');
  auth.verifyToken(token).then(success => {
    //expose req.user to route
    req.foundUser = success;
    next()
  }).catch(err => {
    res.status(401).json({
      success: false,
      data: {
        message: err.message,
        reason: 'JWT ERROR'
      }
    })
  })
})
app.use(require('./router'));


module.exports = app;

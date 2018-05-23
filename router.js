var express = require('express');
var createError = require('http-errors');

var router = express.Router();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');

router.use('/', indexRouter);
router.use('/api/users', usersRouter);
router.use('/api/login', loginRouter);

// catch 404 and forward to error handler
router.use(function (req, res, next) {
  next(createError(404));
});

// error handler
router.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  res.json({
    success: false,
    reason: err
  });
});


module.exports = router;
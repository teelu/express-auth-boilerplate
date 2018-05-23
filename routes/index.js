var express = require('express');
var router = express.Router();

var auth = require('../helpers/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Express' });
});

module.exports = router;

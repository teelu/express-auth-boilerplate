/**
 * login.js
 * 
 * Route for login features of the API
 */
var express = require('express');
var router = express.Router();
var auth = require('../helpers/auth');

router.post('/', function(req, res, next) {
  auth.checkPassword(req.body['email'], req.body['password']).then(result => {
    if (result) {
      auth.generateJWT(req.body['email']).then(token => {
        return res.status(200).json({
          success: true,
          data: token
        });
      }).catch(err => {
        return res.status(400).json({
          success: false,
          data: {
            message: "JWT ERROR",
            reason: err
          }
        });
      })
    } else {
      return res.status(401).json({
        success: false,
        data: {
          message: "Email and/or Password is not correct",
          reason: "BAD LOGIN"
        }
      })
    }
  }).catch(err => {
    res.status(400).json({
      success: false,
      data: {
        message: "AUTH ERROR",
        reason: err
      }
    });
  })
});

module.exports = router;
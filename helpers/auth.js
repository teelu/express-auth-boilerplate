/**
 * auth.js
 * Authentication functions used to be required whenever authentication is needed within the application
 * 
 */

var models = require('../models');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

module.exports = {
  /**
   * checkPassword(@email, @password)
   * 
   * @param - email - string
   * @param - password - string
   * 
   * Given the email and passsword, makes a check in the users table for a user with the matching email
   * and using bcrypt the function will check and return the user if the password is correct.
   * 
   * @resolve - Returns true or false corresponding to correct or incorrect password
   * @reject - Database errors / Bcrypt errors
   */
  checkPassword: (email, password) => {
    return new Promise(((resolve, reject) => {
      models.User.unscoped().findOne({where: {email: email}}).then(user => {
        bcrypt.compare(password, user.password, function(err, res) {
          if (err) {
            reject(err);
            return;
          }

          resolve(res)
        })
      }).catch(err => {
        reject("Database Error " + err);
      })
    }))
  },
  /**
   * generateJwt(email, expiresIn)
   * 
   * @param - email - String
   * @param - expiresIn(OPTIONAL) - String
   * 
   * Generates a json web token given the email of the user.  If given a specific time period for expiriy it will use that.
   * For more documentation regarding time period please check: https://github.com/auth0/node-jsonwebtoken
   * 
   * @resolve - returns json web token for the user authentication
   * @reject - Any errors with finding the user or generating the json web token
   * 
   */
  generateJWT: (email, expiresIn = '1h') => {
    return new Promise(((resolve, reject) => {
      models.User.unscoped().findOne({where: {email: email}}).then(user => {
        jwt.sign({
          data: {
            user_id: user.id,
            user_password: user.password
          }
        }, 
        process.env.JWT_HASH,
        {expiresIn: expiresIn}, 
        function(err, token) {
          if (err) {
            reject(err);
            return;
          }

          resolve(token);
        }
      )
      }).catch(err => {
        reject("Database error: " + err);
      })
    }))
  },

  /**
   * verifyToken(token)
   * 
   * @params - token - string
   * 
   * takes a token and tries to validate the data and checks for expiry.
   * 
   * @resolve - Returns the user data back for next step to use
   * @reject - Invalid token, invalid expiry date, cannot find user
   * 
   */
  verifyToken: (token) => {
    return new Promise(((resolve, reject) => {
      jwt.verify(token, process.env.JWT_HASH, function(err, decoded) {
        if (err) {
          reject(err);
          return;
        }
        models.User.findOne({
          where: {
            id: decoded.data.user_id,
            password: decoded.data.user_password
          }
        }).then(user => {
          resolve(user);
          return;
        }).catch(err => {
          reject(err);
          return;
        })
      })
    }))
  },
}

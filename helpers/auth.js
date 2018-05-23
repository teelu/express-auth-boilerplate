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
  generateJWT: (email, expiresIn = '1 day') => {
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
  verifyToken: (token) => {
    console.log(token);
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

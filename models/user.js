'use strict';

var bcrypt = require('bcrypt');
const uuidv1 = require('uuid/v1');
const saltRounds = 10;

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
      }
    }
  }, {
      defaultScope: {
        attributes: {exclude: ['password']}
    }
  }, {
    getterMethods: {
      fullName() {
        return this.firstName + ' ' + this.lastName;
      }
    },
    setterMethods: {

    }
  });
  User.associate = function(models) {
    // associations can be defined here
  };

  //Use uuid for more unique identifiers
  User.beforeValidate((user, options) => {
    user.id = uuidv1();
  })

  User.beforeSave((user, options) => {
    user.password = bcrypt.hashSync(user.password, saltRounds);
  });

  User.comparePassword = function(password) {
    return true;
    // TODO
  }

  
  return User;
};
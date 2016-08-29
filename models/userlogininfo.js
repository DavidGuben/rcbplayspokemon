'use strict';

var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
  var userlogininfos = sequelize.define('userlogininfos', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      //Creates hashed password to be stored in database
      generateHash: function(password) {
          return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
      }
    }
  });
  return userlogininfos;
};


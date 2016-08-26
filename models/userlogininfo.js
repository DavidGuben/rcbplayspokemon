'use strict';

var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
  var userlogininfos = sequelize.define('userlogininfos', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      generateHash: function(password) {
          return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
      }
    },
    verifyPassword: function(password) {
      return bcrypt.compare(password, this.password, function(err, results) {
        if (err) throw err;
        return result;
      });
    }
  });
  return userlogininfos;
};
'use strict';

var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
  var userlogininfos = sequelize.define('userlogininfos', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      generateHash: function(password) {
          return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
      }
    }
  });

  //Add compare function here so it can be exported and used in redis.js
  //var hash = bcrypt.compareSync(myPlaintextPassword, hash);
  //Also, can generateHash() be moved outside of userlogininfos and still be used by redis.js to hash passwords (need to test).
  //If yes, create 2 seperate functions for generateHash() and verifyPW() and call them independently
  return userlogininfos;
};


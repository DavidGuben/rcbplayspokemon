'use strict';
module.exports = function(sequelize, DataTypes) {
  var userlogininfo = sequelize.define('userlogininfo', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return userlogininfo;
};
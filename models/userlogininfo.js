'use strict';

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var userlogininfos = sequelize.define('userlogininfos', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    freezeTableName: true,
    instanceMethods: {
        generateHash: function(password) {
            return bcrypt.hash(password, bcrypt.genSaltSync(9), function(err, res) {
              if (err) {
                console.log(err);
              }

              console.log(res);
            });
        },
        validPassword: function(password) {
            return bcrypt.compare(password, this.password);
        },
    }   
  });
  return userlogininfos;
};
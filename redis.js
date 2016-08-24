var express = require('express');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var sequelize = require('sequelize');
var app = express();
var path = require('path');
var userlogininfos = require('./models')['userlogininfos'];
var bcrypt = require('bcrypt');
var methods = require('methods');


app.use(bodyParser.urlencoded({
  extended: false
}));

app.engine('handlebars',handlebars({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');


app.use(express.static(path.join(__dirname)));

function hashPassword(password) {
  bcrypt.genSalt(11, function(err, salt) {
    if (err) {
      return console.log(err);
    }

    bcrypt.hash(password, salt, function(err, hash) {
      if (err) {
        return console.log(err);
      }

      console.log(hash);
    });

    console.log(salt);
  });
};

/*userlogininfos.methods.hashPassword = function (password, cb) {
  bcrypt.genSalt(11, function(err, salt) {
    if (err) {
      return cb(err);
    }

    bcrypt.hash(password, salt, function (err, hash) {
      if (err) {
        return cb(err);
      }

      return cb(null, hash);
    })
  })
}*/

//hashPassword('password');

app.get('/', function(req, res){
 
    res.render('index');
});

app.get('/home/:id', function(req, res) {
    console.log("beginning of redirect");
    console.log(req.params);
    console.log('specific users homepage' + req.params.id);
    userlogininfos.findOne({ where: {id: req.params.id}}).then(function(userData) {
      console.log(userData);
      var user = userData.dataValues;
      console.log("before home render");
      res.render('home', {
        userData: userData
      });
    });
});

app.post('/login', function(req, res){

    userlogininfos.findOne({ where: {username: req.body.username }}).then(function(data){
    console.log(data);
    console.log("login");
     res.redirect('/home/' + data.dataValues.id)
      


  });

});
app.post('/createNewUser',function(req, res){
   console.log(req.body.username);
   console.log(req.body.password);
   console.log(req.body.email);
   userlogininfos.create({
     username: req.body.username,
     password: req.body.password
  }).then(function(data){
    console.log('data',data);
    res.redirect('/home/' + data.dataValues.id)
  });
});



var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('connection running')
});

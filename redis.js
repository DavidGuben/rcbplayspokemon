var express = require('express');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var sequelize = require('sequelize');
var app = express();
var path = require('path');
var userlogininfos = require('./models')['userlogininfos'];


app.use(bodyParser.urlencoded({
  extended: false
}));

app.engine('handlebars',handlebars({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');


app.use(express.static(path.join(__dirname)));

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

    //Encrypted passwords cannot be retrieved from table
    //Tried console.loging various outputs, and comparing plaintext input to hash but unsuccesful
    userlogininfos.findOne({ where: {username: req.body.username, password: req.body.password }}).then(function(data){
    console.log(data);
    console.log("DATA PASSWORD IS ",data.dataValues.id.password);
    userlogininfos.verifyPassword(data.dataValues.password);
    console.log("login");
     res.redirect('/home/' + data.dataValues.id)
      
  });

});

app.post('/createNewUser',function(req, res){
  console.log(req.body.username);
  console.log(req.body.password);
  var hash = userlogininfos.generateHash(req.body.password);
  console.log("HASH LOG: ", hash)
   userlogininfos.create({
     username: req.body.username,
     password: hash
  }).then(function(data){
    res.redirect('/home/' + data.dataValues.id)
  });
});



var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('connection running')
});
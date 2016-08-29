var express = require('express');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var sequelize = require('sequelize');
var app = express();
var path = require('path');
var bcrypt = require('bcrypt');
var userlogininfos = require('./models')['userlogininfos'];
var bcrypt = require('bcrypt-nodejs');


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
    
  //Searches database for username
  userlogininfos.findOne({ where: {username: req.body.username }}).then(function(data){

    //Compares the plaintext PW provided by user to the encrypted PW stored in database (returns true or false)
    var validPassword = bcrypt.compareSync(req.body.password, data.dataValues.password);

    //If correct password then user is redirected to their homepage 
    if (validPassword) {
      console.log("Valid password = ", validPassword);
      console.log("LOGGING IN ...");
      res.redirect('/home/' + data.dataValues.id);
    } else {  
      console.log("INVALID PASSWORD  = ",validPassword);
      //If invalid password redirect to the homepage
      res.redirect('/')
     }

     //res.redirect('/home/' + data.dataValues.id)
      
  });

});

app.post('/createNewUser',function(req, res){
  //Creates hashed pw from plaintext and stores it in var hash;
  var hash = userlogininfos.generateHash(req.body.password);
  console.log("HASH: ", hash)
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
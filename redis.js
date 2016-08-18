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

app.get('/:id', function(req, res) {
    console.log(req.params);
    console.log('specific users homepage' + req.params.id);
    userlogininfos.findOne({ where: {id: req.params.id}}).then(function(user) {
      console.log(user.dataValues);
      var user = user.dataValues;
      res.render('home', {
        userData: user
      });
    });
});

app.post('/login', function(req, res){

    userlogininfos.findOne({ where: {username: req.body.username }}).then(function(data){
    console.log(data);
     res.redirect('/' + data.dataValues.id)
      


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
    res.redirect('/' + data.dataValues.id)
  });
});



var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('connection running')
});

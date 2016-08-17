var express = require('express');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars');
var sequelize = require('sequelize');



var userlogininfos = require('./models')['userlogininfos'];
userlogininfos.sync();

var app = express();


app.use(express.static(__dirname,  + '/public'));

app.use(bodyParser.urlencoded({
  extended: false
}));

app.engine('handlebars',handlebars({
  defualtLayout: 'main'
}));

app.set('view engine', 'handlebars');

//app.get('/', function(req, res){
    //var indexObject = {
    //username: "mike",
    //password: "code"
    //}
    //res.render('test', indexObject);
//});

app.get('/', function(req, res){

    userlogininfos.findAll({}).then(function(result){
    console.log(result);
    return res.render('index', {
      userlogininfos: result
    });

  });

});

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('connection running')
});

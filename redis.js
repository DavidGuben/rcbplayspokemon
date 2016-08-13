var express = require('express');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars');
var sequelize = require('sequelize');



var userlogininfo = require('./models')['userlogininfo'];
userlogininfo.sync();

var app = express();

app.use(express.static(__dirname,  + '/public'));

app.use(bodyParser.urlencoded({
  extended: false
}));

app.engine('handlebars',handlebars({
  defualtLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.get('/', function(req, res){
    res.render('index');
})





var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('connection running')
});

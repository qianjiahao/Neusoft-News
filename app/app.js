var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var port = process.env.PORT || 5000;

var routes = require('./routes/index');


var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret:"1234567890QWERTY",
	cookie: {maxAge: 1000*60*5}, 
    resave: false,
    saveUninitialized: false,

}))
routes(app);

module.exports = app;


app.listen(port,function(){
    console.log('server on port : ', port);
})

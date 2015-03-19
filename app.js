var express = require('express');
var bodyParser = require('body-parser');
var indexController = require('./controllers/index.js');
var apiController = require('./controllers/api.js');
var authController = require('./controllers/auth.js');
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');


// Mongoose
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/food-app');

// Passport
var passportConfig = require('./config/passport');

// NOT INCLUDED IN MY SCAFFOLDER
// var routes = require('./routes/index');
// var users = require('./routes/users');
// var authentication =  require('./routes/authentication'); 

//Seed the database:
require('./models/seeds/foodSeed.js');

var app = express();

// middleware setup

// var sassMiddleware = require('node-sass-middleware');
// app.use(sassMiddleware(({
// 	src: __dirname + "/assets",
// 	dest: __dirname + "/static",
// 	debug: true
// }))); 


app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());



app.use(session({
  secret: "secret key",
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// app.use('/auth', authentication); 
// app.use(authController.ensureAuthenticated); 
// why are the bottom two not stock? 
// app.use('/', routes);
// app.use('/users', users); 

// login routes
app.get('/', indexController.index);
app.get('/login', authController.login);
app.get('/logout', authController.logout); 

// api routes
app.post('/api/addFood', apiController.addFood);
app.post('/api/deleteFood', apiController.deleteFood);
app.get('/api/getFood/:food_id', apiController.getFood);
app.post('/api/editFood/:food_id', apiController.editFood);
app.post('/api/transferFood', apiController.transferFood); 

//wolfram routes

app.post('/api/wolframTest', apiController.wolframTest);

var port = process.env.PORT || 3775
var server = app.listen(port, function() {
	console.log('Express server listening on port ' + server.address().port);
});


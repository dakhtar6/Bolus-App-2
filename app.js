var express = require('express');
var bodyParser = require('body-parser');
var indexController = require('./controllers/index.js');
var apiController = require('./controllers/api.js');
var passport = require('passport');
var session = require('express-session');


// Mongoose
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/food-app');

// Passport
var passportConfig = require('./config/passport');

// NOT INCLUDED IN MY SCAFFOLDER
// var routes = require('./routes/index');
// var users = require('./routes/users');
var authentication =  require('./routes/authentication'); 

//Seed the database:
require('./models/seeds/foodSeed.js');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({secret: 'secret key'})); 
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authentication); 
app.use(passportConfig.ensureAuthenticated); 
// why are the bottom two not stock? 
// app.use('/', routes);
// app.use('/users', users); 

app.get('/', indexController.index);

// api routes
app.post('/api/addFood', apiController.addFood);
app.post('/api/deleteFood', apiController.deleteFood);
app.get('/api/getFood/:food_id', apiController.getFood);
app.post('/api/editFood/:food_id', apiController.editFood);

var server = app.listen(3775, function() {
	console.log('Express server listening on port ' + server.address().port);
});


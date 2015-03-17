var express = require('express');
var bodyParser = require('body-parser');
var indexController = require('./controllers/index.js');
var apiController = require('./controllers/api.js');

// Mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/food-app');

//Seed the database:
require('./models/seeds/foodSeed.js');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', indexController.index);

// api routes
app.post('/api/addFood', apiController.addFood);
app.post('/api/deleteFood', apiController.deleteFood);
app.get('/api/getFood/:food_id', apiController.getFood);
app.post('/api/editFood/:food_id', apiController.editFood);

var server = app.listen(3775, function() {
	console.log('Express server listening on port ' + server.address().port);
});


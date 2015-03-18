var Food = require('../models/food.js');

var indexController = {
	index: function(req, res) {
		// 1. Get all the foods from the DB
		Food.find({}, function(err, foodsFromDB){
			// 2. Pass the resulting documents (foods)
			// 		to the render function.
			res.render('index', {
				foods: foodsFromDB,
				// username: req.user.username
			});
		});
	}
};

module.exports = indexController;

var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; 
// seed a user
var user = new User({
	username: 'Daneyal',
	email: 'daneyalakhtar@gmail.com',
	password: 'test'
}); 
user.save(function(err, user){
	if(err){
		console.log(err);
	} else {
		console.log('Seeded user');
	}
}); 

//sesssions serialization
passport.serializeUser(function(user, next){
	//convert user object to session storing id
	next(null, user._id);
});
passport.deserializeUser(function(id, next){
	User.findById(id, function(err, user){
		next(err,user);
	});
}); 

//ensure authentication method
module.exports = {
	ensureAuthenticated: function(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}
		res.redirect('/auth/login');
	}
};

//Strategies
var LocalStrategy = new LocalStrategy(
	function(username, password, next){
		User.findOne({username: username}, function(err, user){
			if(err){
				return next(err); 
			}
			if(!user){
				return next(null, false);
			}

			// given username matches a database document
			user.comparePassword(password, function(err, isMatch){
				if(err){
					return next(err);
				}
				if(isMatch){
					return next(null, user);
				} else{
					return next(null, false); 
				}
			});
		});

	}
); 

passport.use(LocalStrategy);
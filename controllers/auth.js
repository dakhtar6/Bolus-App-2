// var express = require('express'); 
// var router = express.Router();
// var passport = require('passport');

// router.get('/login', function(req, res){
// 	res.render('login', {title: 'Login'});
// });

// router.post('/login', function(req, res, next){
// 	passport.authenticate('local', function(err, user, info){
// 		if(err){
// 			return next(err); 
// 		}
// 		if(!user){
// 			return res.redirect('/auth/login');
// 		}

// 		//user has sucessfully authenticated!
// 		req.login(user, function(err){
// 			if(err){
// 				return next(err);
// 			}

// 			//user has successfully logged in
// 			return res.redirect('/');
// 		});
// 	})(req, res, next);
// });

// router.get('/logout', function(req, res){
// 	req.logout();
// 	res.redirect('/auth/login');
// });
// module.exports = router; 

module.exports = {
	login: function(req, res) {
		console.log(req.user);
		if(req.isAuthenticated()){
			res.redirect('/');
		} else {
			res.render('login', 
				{title: 'Login',
				user: req.user
			});
		}
	},
	loginSuccess: function(req, res){
		res.redirect('/');
	},
	logout: function(req, res) {
		req.logout();
		res.redirect('/login');
	},
	ensureAuthenticated: function(req, res, next) {
		if(req.isAuthenticated()) {
			return next();
		}
		res.redirect('/'); 
	},
	ensureAuthenticatedAjax: function(req, res, next) {
		if(req.isAuthenticated()) {
			return next();
		}
		res.send(401); 
	}	
};
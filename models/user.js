var mongoose = require('mongoose');
var bcrypt = require('bcrypt'); 

var userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
}); 

userSchema.pre('save', function(next){
	//check if this is a new password
	if (!this.isModified('password')){
		return next(); // cancel execution since password is ok
	}
//initiate encryption
	var user = this;
	bcrypt.genSalt(10, function(err, salt){
		if(err){
			return next(err);
		}
		//we have a successful salt
		bcrypt.hash(user.password, salt, function(err, hash) {
			if(err){
				return next(err); 
			}

			//we have a successfully hashed password
			user.password = hash; 
			next(); 
		}); 
	});
	
});

userSchema.methods.comparePassword = function(candidatePassword, next) {
	//compare the saved, encrypted password to the user entered one
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
		if(err){
			return next(err);
		}
		next(null, isMatch); 
	});
};


var User = mongoose.model('User', userSchema);

module.exports = User; 
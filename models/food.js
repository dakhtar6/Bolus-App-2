var mongoose = require('mongoose');

var foodSchema = mongoose.Schema({
  name: String,
  servingSize: String,
  carbohydrates: Number,
});

var Food = mongoose.model('Food', foodSchema);

module.exports = Food;

var Food = require('../models/food.js');

var config;
if(process.env.WOLFRAM_KEY){
  config = {
    wolframKey: process.env.WOLFRAM_KEY
  };
} else {
  config = require('../config/api.js');
}
 
var wolfram = require('wolfram').createClient(config.wolframKey);

var apiController = {
  addFood: function(req, res){
    // 1. Store a reference to the submitted data
    var newFood = req.body;

    // 1.5. Do any validation here

    // 2. Create a new Food instance from the data
    var food = new Food(newFood);

    // 3. Save the new instance
    food.save(function(err, savedFood){
      // 4. Once the save is completed, send the response
      res.send(savedFood);
    });
  },

  // transferFood: function(req, res){
    
  // },

  deleteFood: function(req, res){
    var toDelete = req.body.targetId;
    Food.findByIdAndRemove(toDelete, function(err, result){
      // Assume success here:
      res.send('success');
    });
  },

  getFood: function(req, res){
    // res.send(req.params.food_id);
    var foodId = req.params.food_id;
    // Find the given ID in the database
    Food.findById(foodId, function(err, result){
      // console.log('Err:', err);
      // console.log('Result:', result);
      // ## ANY ERROR CHECKING GOES HERE
      // Send the food data right back to the requester
      res.send(result);
    });
  },

  editFood: function(req, res){
    // res.send({
    //   targetId: req.params.food_id,
    //   targetUpdates: req.body
    // });
    var foodId = req.params.food_id;
    
    Food.findByIdAndUpdate(foodId, req.body, function(err, result){
      res.send(result);
    });
  },
  
  wolframTest: function(req, res){

    console.log(req.body.foodsearch); 

wolfram.query("carbohydrates in " + req.body.foodsearch, function(err, result) {
  if(err) throw err;
  console.log("Result: %j", result);
  res.send(result);
});
  }
};

module.exports = apiController;
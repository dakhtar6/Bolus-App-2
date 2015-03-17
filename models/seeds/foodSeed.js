var Food = require('../food.js');

Food.find({}, function(err, documents){
  if(documents.length === 0){
    // Prefill the empty database with some Food

    var momsApplePie= new Food({
      name: 'Apple Pie',
      servingSize: '1 slice',
      carbohydrates: 44
    });
    momsApplePie.save();

    var superSpicyChickenAndRice = new Food({
      name: 'Super Spicy Chicken and Rice',
      servingSize: '1 cup',
      carbohydrates: 37
    });
    superSpicyChickenAndRice.save();

    var wackyChocolateCake = new Food({
      name: 'Wacky Chocolate Cake',
      servingSize: '1 slice',
      carbohydrates: 36
    });
    wackyChocolateCake.save();

  }
});

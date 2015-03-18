// CLIENT-SIDE

/**
 * Handle submission of the new food form
 */
var onFoodSubmit = function(e){
  // Prevent default submission behavior
  e.preventDefault();

  // Get data from form inputs:
  //  The keys of this object need to match
  //  up with the keys in our schema because
  //  we are just directly storing the submitted
  //  object into the database with req.body
  //  on the server-side.
  var newFoodData = {
    name: $('#food-name').val(),
    servingSize: $('#serving-size').val(),
    carbohydrates: parseFloat($('#carbohydrate-count').val()),
  };

  // Reset the form easily
  this.reset();

  // Add validation here if necessary

  // If the data is good, let's make an ajax call
  $.post('/api/addFood', newFoodData, function(dataFromServer){
    console.log('DataFromServer:', dataFromServer);

    // Add the new food to the list
    // $('#food-list').append(
    //   '<li>' + dataFromServer.name + '</li>'
    // );

    // Clone the first food in the list:
    //  Works in a pinch, but if there are no foods
    //  in the list to get, then this will fail
    var newFoodEl = $('.food').first().clone();
    newFoodEl.find('strong').text(dataFromServer.name);
    newFoodEl.attr('data-id', dataFromServer._id);
    $('#food-list').append(newFoodEl);
  });
};

var onFoodSearch = function(e){
  e.preventDefault();

  var foodQuery = {
    query: $('#food-search').val()
  };

  $.post('/api/wolframTest', foodQuery, function(dataFromServer){
    var carbValue = dataFromServer[0];
    console.log(carbValue);
    //should I use .text() instead?
    $("#carbValue").text("Total Carbohydrate Value = " + carbValue);
  }); 

};


/**
*Handle clicking "transfer" on any food in the list
*/

var foodTransfer = function(e){
  e.preventDefault();

};

/**
 * Handle clicking "delete" on any food in the list
 */

var foodDelete = function(e){
  e.preventDefault();

  var originalFoodElement = $(this).closest('.food');
  var targetId = originalFoodElement.attr('data-id');

  $.post('/api/deleteFood', {targetId: targetId}, function(dataFromServer){
    // When a success response is sent back
    originalFoodElement.remove();
  });
};

var foodView = function(e){
  e.preventDefault();

  $('#view-modal').modal('show');

  // get the details of the clicked food
  // from the server

  var originalFoodElement = $(this).closest('.food');
  var targetId = originalFoodElement.attr('data-id');

  $.get('/api/getFood/' + targetId, function(dataFromServer){
    $('#view-modal .food-name').text(dataFromServer.name);
    $('#view-modal .serving-size').text(dataFromServer.servingSize);
    $('#view-modal .carbohydrate-count').text(dataFromServer.carbohydrates + " grams of carbohydrates");
  });
};


var foodEdit = function(e){
  e.preventDefault();

  $('#edit-modal').modal('show');

  var originalFoodElement = $(this).closest('.food');
  var targetId = originalFoodElement.attr('data-id');

  $.get('/api/getFood/' + targetId, function(dataFromServer){
    $('#edit-modal .food-name').val(dataFromServer.name);
    $('#edit-modal .serving-size').val(dataFromServer.ABV);
    $('#edit-modal .carbohydrate-count').val(dataFromServer.type);
    $('#edit-modal .food-id').val(dataFromServer._id);
  });
};

var foodEditSubmit = function(e){
  e.preventDefault();

  var dataFromClient = {
    name: $('#edit-modal .food-name').val(),
    servingSize: $('#edit-modal .serving-size').val(),
    carbohydrates: $('#edit-modal .carbohydrate-count').val(),
  };

  var targetId = $('#edit-modal .food-id').val();

  $.post('/api/editFood/' + targetId, dataFromClient, function(dataFromServer){
    console.log(dataFromServer);

    // Hide the modal in the end
    $('#edit-modal').modal('hide');

    // Update the on-page DOM element
    $('[data-id="'+targetId+'"]')
      .find('strong')
      .text(dataFromServer.name);
  });
};

// Initialize the event listeners
$(document).on('ready', function(){

  // When submitting the new-food form,
  // use AJAX to post the data
  $('#new-food').on('submit', onFoodSubmit);

  //Handle transfer clicks
  // $(document).on('click', '.transfer', foodAdd);

  // Handle deletion clicks
  $(document).on('click', '.delete', foodDelete);

  // Handle view clicks
  $(document).on('click', '.view', foodView);

  // Handle edit clicks
  $(document).on('click', '.edit', foodEdit);

  // Handle submitting the edit form
  $('#edit-form').on('submit', foodEditSubmit);
});

///////////////////////////////////////////////////////////////////////////////////////////


$(document).on('ready', function() {

  ////////////////////////////////////////
  //CALCULATES THE BOLUS INSULIN DOSAGE//
  //////////////////////////////////////
  
  var BolusCalc = function(carbohydrateIntake, carbToInsulinRatio, correctionFactorInsulinRatio, currentBloodGlucose, desiredBloodGlucose) {
   this.carbohydrateIntake = carbohydrateIntake;
   this.carbToInsulinRatio = carbToInsulinRatio;
   this.correctionFactorInsulinRatio = correctionFactorInsulinRatio;
   this.currentBloodGlucose = currentBloodGlucose;
   this.desiredBloodGlucose = desiredBloodGlucose;  
  }; 
    
  BolusCalc.prototype.calculate = function() {
   var foodBolus = this.carbohydrateIntake / this.carbToInsulinRatio;

   var correctiveBolus = (this.currentBloodGlucose - this.desiredBloodGlucose) / this.correctionFactorInsulinRatio;

   var totalBolus = foodBolus + correctiveBolus;

   return totalBolus; 
  };

  // Troubleshoot NAN - Prevent users from entering fictious inputs//

  $("#bolusCalcButton").on("click", function() {
      var helpme = $("[name='Carbohydrate Intake']").val();
     var carbohydrateIntake = (helpme === " ")? 0:  parseInt(helpme);
     var carbToInsulinRatio = parseInt($("[name='Carb to Insulin Ratio']").val()); 
     var correctionFactorInsulinRatio = parseInt($("[name='Correction Factor / Insulin Sensitivity']").val());
     var currentBloodGlucose = parseInt($("[name='Current Blood Glucose']").val());
     var desiredBloodGlucose = parseInt($("[name='Desired Blood Glucose']").val());

     var thisBolusCalc = new BolusCalc(carbohydrateIntake, carbToInsulinRatio, correctionFactorInsulinRatio, currentBloodGlucose, desiredBloodGlucose);

     var bolusTotal = thisBolusCalc.calculate();
     console.log(bolusTotal);

     $("#bolusCalcResult").text("Total Bolus = " + bolusTotal + " units of insulin"); 

  });

  this.reset();

//   //APPENDS FOOD ITEMS AND CARB VALUES TO THE DOM//

//   for(var i=0; i<foodList.length; i++) {
//     $("#foodBox").prepend("<div>" + foodList[i].name + " " + "<input type='checkbox' class='food-item' value='" + foodList[i].carbohydrates + "'>" + "</div>");
//   }

//   //SUMS CARB VALUES FOR CHECKED BOXES AND INSERTS THEM INTO THE CARBOHYDRATE INTAKE INPUT//

//   $("#foodBoxButton").on("click", function() {
//     var total = 0;
//     $(".food-item:checked").each(function() {
//       console.log($(this));
//       total += +$(this).val();
//     }); 
    
//     $("#CarbIntake").val(total);

//   });


});


////////////////////////////////////////////////////////////////////////////////////////////

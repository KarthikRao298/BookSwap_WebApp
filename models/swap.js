/*
 * FIle name: swap.js
 * Description: This file contains the schemas for the swap & offer collections
 */

/*
 a swap table consists of 4 fields
 user_1 : this is the user who has offered the item_1 for swap
 user_2 : this is the user to whome user_1 has requested for swapping
item_1 : this is the item_1 offered by user_1
item_2 : this is the item_2 requested from user_2 by user_1

*/

var offerSchema = new mongoose.Schema({

  userID: String,
  item:{
    itemCode: String,
    itemName: String,
    catalogCategory: String,
    description: String,
    rating: String,
    imageUrl: String
  }
});
var offerModel = mongoose.model ('offerModel', offerSchema);

var swapSchema = new mongoose.Schema({

  userID: String,
  item:{
    itemCode: String,
    itemName: String,
    catalogCategory: String,
    description: String,
    rating: String,
    imageUrl: String
  }

});

var swapModel = mongoose.model ('swapModel', swapSchema);


module.exports.offerModel = offerModel;
module.exports.swapModel = swapModel;

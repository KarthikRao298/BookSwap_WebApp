/*
 * File name: UserItem.js
 */

var mongoose = require('mongoose');

var UserItem = function(item,rating,status,swapItem,swapItemRating,swapperRating){
    
    /* if the user item status is available then there’s no values for Swap Item, Swap Item
    Rating, or Swapper Rating. When the status is pending then Swap Item has a value but
    not the ratings for the swap item and the swapper. When the status is swapped then the
    user will be able to rate the swap item and the swapper (the other user) */
    
    var userItemObj = {
        /* an item object that belongs to this user (this user is the one that offered/added this item)*/
        item:item,
        /* this user’s rating for their item */
        rating:rating,
        /* this attribute should indicate swap item status – available, pending (offer made),
        swapped (offer accepted) */
        status:status,
        /* this is the item swapped with this user item (an item that was offered for
        swapping by another user and was swapped with this user item).*/
        swapItem:swapItem,
        /* this is the user’s rating for the item swapped with this user item */
        /* based on A4_m1 this is average of all the ratings*/
        swapItemRating:swapItemRating,
        /* this is the user’s rating for the other user that owns the item swapped
        with this user item */
        /* based on A4_m1 this is average of all the ratings*/
        swapperRating:swapperRating,
    };

    return userItemObj;
};
/*
function UserItem (item,rating,status,swapItem,swapItemRating,swapperRating){

    this.userID = userID;
    this.userItems = userItems;

};
*/


var userItemSchema = new mongoose.Schema({

  userID: String,
  
  itemCode: String,

  rating: String,
  status: String,

  swapItem: String,
  
  swapItemRating: String,
  swapperRating: String
  
},{collection:'useritem'});

var userItemModel = mongoose.model ('useritem', userItemSchema);




module.exports.UserItem = UserItem;
module.exports.userItemModel = userItemModel;



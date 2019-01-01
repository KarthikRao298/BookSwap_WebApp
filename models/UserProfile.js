
var userItem = require ('./UserItem.js');

/* UserProfile – A class to manage a List / Collection (your choice) of UserItem(s) 
 * User ID – attribute used for user identification
 * User Items – attribute used for UserItem(s)
 */
function UserProfile (userID, userItems){


    this.userID = userID;
    this.userItems = userItems;

};

/*
 * removes the specified item from the user's profile & Db 
 * getUserProfile() has to be called immediately after calling removeUserItem()
 */
UserProfile.prototype.removeUserItem = function(itemCode){
 
     return new Promise((resolve, reject) => {

    var status = false;

    for (var i = 0; i < this.userItems.length; i++) {

        if(this.userItems[i].item.itemCode === itemCode ){

            //console.log("***Inside UserDB removeUserItem length of userItems before deletion*** "+userProfileObj.userItems.length)
            this.userItems.splice(i, 1);
            //console.log("***Inside UserDB removeUserItem length of userItems before deletion*** "+userProfileObj.userItems.length)
            status = true;
            break;
        }
    }

        userItem.userItemModel.findOne({userID:this.userID ,itemCode:itemCode}).then(record =>{
                    record.remove(function(err) {
            if (err) throw err;
            status = status && true;

            console.log("Item deleted from the user's DB ");
            resolve (status);
        });

        }).catch(err => {
            console.log("err");
            return reject(err);
        })
    })
}


// returns a specific item from the user's list of items
UserProfile.prototype.getUserItem = function(itemCode){

    var item = null;

//            console.log( "this.userItems[0], itemCode", this.userItems.length, itemCode);
//        console.log( "this.userItems[1], itemCode", this.userItems[1].item, itemCode);

    for (var i = 0; i < this.userItems.length; i++) {
    
        //console.log( "this.userItems[i].itemCode, itemCode", this.userItems[i].item.itemCode, itemCode);

        if(this.userItems[i].item.itemCode === itemCode ){
            item = this.userItems[i];
        }
    }
    return item;
};

/*
 * returns a List / Collection of UserItem from this user profile
 */
UserProfile.prototype.getAllItemsOfUser = function(){

    return this.userItems;
};

/*
 * clears the entire user profile contents
 */
UserProfile.prototype.emptyProfile = function(){

    this.userID = null;
    this.userItems = null;
    return true;
};

/*
 * check if any item in the user profile is marked available
 */
UserProfile.prototype.IsItemsForSwapAvailable = function(){

    var status = false;

    for (var i = 0; i < this.userItems.length; i++) {
        
        if(this.userItems[i].status === 'available' ){
          status = true;
        }
    }
    return status;
};

/*
 * returns the list of items that are marked available
 */
UserProfile.prototype.GetAvailableItems = function(){

    var availableItemList = [];

    for (var i = 0; i < this.userItems.length; i++) {

        if(this.userItems[i].status === 'available' ){
            availableItemList.push(this.userItems[i]);
        }
    }
    return availableItemList;
};

/*
 * updates the status of the item in the user's profile
 */
UserProfile.prototype.UpdateUserProfile = function(item){

    var success = false;

    for (var i = 0; i < this.userItems.length; i++) {
        //if matching item is present then update it
        if(this.userItems[i].item.itemCode === item.item.itemCode){
            //console.log("***Inside updateUserProfile before update status and item code *** "+userProfile.userItems[i].status+" "+userProfile.userItems[i].item.itemCode+" "+i)
            this.userItems[i].status = item.status
            //console.log("***Inside updateUserProfile after update status*** "+userProfile.userItems[i].status)
            success = true;
        }
    }
   return success;
};

module.exports.UserProfile = UserProfile;
//module.exports.getUserItems = UserProfile.prototype.getUserItems;


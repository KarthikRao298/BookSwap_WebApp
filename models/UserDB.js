/* File name: UserDB.js
 * Description: static dummy DB consisting of user profiles
 *              for the application.
 */

var userProfile = require ('./UserProfile.js');
var user = require ('./User.js');
var itemDB = require ('./item.js');
var userItem = require ('./UserItem.js');
var mongoose = require('mongoose');

/*
 * addUser (firstName, lastName, email, address1, address2, city, state, zipcode, country)
 * Description: This method adds a user with the provided values as the user attributes.
 * Note: That the userId is not provided as this should be auto incremented to ensure each user ID
 *  is unique.
 * TBD: Test this
 */
var addUser = function (userId, firstName, lastName, email, address1, address2, city, state, postalCode, country, password){

    console.log(userId);
    console.log(city);
    console.log(state);
    console.log(address1);
        console.log(address2);
    /*var userObj = new user.User (userId, firstName, lastName, email, address1,
                    address2, city, state, postalCode, country,
                    password);
  */
    //console.log(userObj)
    return new Promise((resolve, reject) => {

    //addUserToDb (userObj);

            var newUser = user.userModel({
                userID:userId,
                firstName: firstName,
                lastName: lastName,
                emailAddress: email,
                address1Field: address1,
                address2Field: address2,
                city: city,
                state: state,
                postalCode: postalCode,
                country:country,
                password:password
    });

    // save the user
    newUser.save(function(err) {
      if (err) throw err;

      console.log('User registered in DB!');
      resolve("success");

    });
    });
}

/*
 * addUser (User user)
 * Description: This method adds a user with the attribute values from the provided User object
 * TBD: Test this
 */
var addUserToDb = function (user){

    console.log("Adding following user to DB: ", user);
/*
    user.userModel.findOneAndUpdate(
    {emailAddress: user.emailAddress}, // find a document with emailAddress

    {$set : {  userId:userId,
                firstName: firstName,
                lastName: lastName,
                emailAddress: emailAddress,
                address1Field: address1Field,
                address2Field: address2Field,
                city: city,
                state: state,
                postalCode: postalCode,
                country:country,
                password:password

              }},
    
        {upsert: true, new: true, runValidators: true}, // options
    function (err, doc) { // callback
    console.log("new user data added to DB ");
    })

    */

        var newUser = user.userModel({
                userID:userId,
                firstName: firstName,
                lastName: lastName,
                emailAddress: emailAddress,
                address1Field: address1Field,
                address2Field: address2Field,
                city: city,
                state: state,
                postalCode: postalCode,
                country:country,
                password:password
    });

    // save the user
    newUser.save(function(err) {
      if (err) throw err;

      console.log('User created!');
    });
}



/* returns a set of all the users in the hardcoded database */
var getUsers = function () {

    console.log();
    return new Promise((resolve, reject) => {
        user.userModel.find({}).then(docs =>{
            //console.log(docs);
            resolve(docs);
        }).catch(err => {
            console.log("err");
            return reject(err);
        })
    })


};

/* returns the user details if valid else returns undefined */
var getUser = function (email, password) {

    console.log();
    return new Promise((resolve, reject) => {
      console.log(email)
      console.log(password)
        user.userModel.findOne({"emailAddress":email }).then(docs =>{
            //console.log(docs);
            if (docs === null){
              console.log("user not found in DB");
              resolve (undefined)
            }
            resolve(docs);
        }).catch(err => {
            console.log("err");
            return reject(err);
        })
    })
};

/* returns the user details if valid else returns undefined
 * this funciton is used during registration
 */
var isUserExist = function (email) {

    console.log();
    return new Promise((resolve, reject) => {
      console.log(email)
        user.userModel.findOne({"emailAddress":email}).then(docs =>{
            //console.log(docs);
            if (docs === null){
              console.log("user not found in DB");
              resolve (undefined)
            }
            resolve(docs);
        }).catch(err => {
            console.log("err");
            return reject(err);
        })
    })
};


    /* returns a UserProfile object for a specific user */

/* 
 * create a list of items belonging to the user with given userID
 * from the itemID, fetch the item from DB & populate the item obj
 * if swapItem is not null then fetch the details of the swap item 
 * from the from DB & populate the swapitem obj
 */

//fetch the item
//assign the item to the itemObj
// copy the ratings & other fields from the userItem to the userItem
// if swapItem is not null then fetch the details of the swap item 
// from the from DB & populate the swapitem obj


var getUserProfile = function(userId){
console.log();
     return new Promise((resolve, reject) => {
       userItem.userItemModel.find({userID:userId}).then(records => {
         userItemsCodeList = []

           for (var i = 0; i < records.length; i++) {
             userItemsCodeList.push(records[i].itemCode)
           }
           userItemsList = []
           listOfPromises = []
           //console.log("length of listOfPromises ",userItemsCodeList.length)

           for (var i = 0; i < userItemsCodeList.length; i++) {
             listOfPromises.push(itemDB.getItem(userItemsCodeList[i]))
           }
          // console.log("length of listOfPromises ",listOfPromises.length)
           return (listOfPromises)
       
       }).then(docs =>{
          Promise.all(docs).then(userItemList=>{

          // generate the list of swap items
          //console.log(userItemList )
             //resolve(results);
             //var swapItemList = ['asd', 'asdf'];

          userItem.userItemModel.find({userID:userId}).then(records_2 => {
              swapItemsCodeList = []

              for (var i = 0; i < records_2.length; i++) {
                  if (records_2[i].swapItem !== null){
                      swapItemsCodeList.push(records_2[i].swapItem)
                  } else {
                      swapItemsCodeList.push("NA");                    
                  }
              }
              swapItemsList = []
              listOfPromises = []
              //console.log("length of listOfPromises ",swapItemsCodeList.length)

              for (var i = 0; i < swapItemsCodeList.length; i++) {
                  listOfPromises.push(itemDB.getItem(swapItemsCodeList[i]))
              }
              return [userItemList, listOfPromises, records_2];

              }).then (docs =>{
              
                  Promise.all(docs[1]).then(swapItemList=>{
                      //console.log("user item list")
                      //console.log(docs[0]);
                      //console.log("swap item list")
                      //console.log(swapItemList);
                      //console.log("records_2")
                      //console.log(docs[2]);


itemsList = docs[0];
swapItemsList = swapItemList;
records_3 = docs[2];
 var response = []
 for (var i = 0; i < itemsList.length; i++) {
     response.push( {item:itemsList[i], rating:records_3[i].rating, status: records_3[i].status, 
                     swapItem: swapItemsList[i], swapItemRating: records_3[i].swapItemRating,
                     swapperRating: records_3[i].swapperRating })
 }

//console.log("userId",userId);

    var userProfObj = new userProfile.UserProfile (userId, response);


 //userProfObj = {userId:userId, userItems: response};
 resolve (userProfObj)


                            })
          })
      })
   })
})
}





/* 
 * returns a list of items which are not in the logged in users  list of item. 
 * i.e it returns items not belonging to the logged in user 
 */
var getCatlogForUser = function(userId){
  
 /*
  * - fetch all the items available in the DB
  * - fetch all the items in the user's profile
  * - iterate through the list of all items in the DB & create the catalog for the user
  */

    return new Promise((resolve, reject) => {

        listOfPromises = []
        listOfPromises.push(itemDB.getItems());
        listOfPromises.push(getUserProfile(userId));

        Promise.all(listOfPromises).then(outputList=>{
            //console.log ("all items in the db");
            var completeItemsList = outputList[0];
            var userItemsList = outputList[1].userItems;
            var catalogForUser = []

            console.log ("items in user's profile");

            //console.log (userItemsList);

            for (var i = 0; i < completeItemsList.length; i++) {
                var flag = false
                
                for (var j = 0; j< userItemsList.length; j++) {
                    
                    if(completeItemsList[i].itemCode === userItemsList[j].item.itemCode){
                        flag = true
                        console.log("item will be excluded "+userItemsList[j].item.itemCode)
                        break
                    }
                }
                
                if(flag === false){
                    catalogForUser.push(completeItemsList[i])
                }
            }
            console.log("length of catalogForUser: ",catalogForUser.length )
            resolve (catalogForUser)
        })
    })
}


//module.exports.userItemModel = userItemModel;
//module.exports.userModel = userModel;
module.exports.getUser = getUser;
module.exports.isUserExist = isUserExist;
module.exports.addUser = addUser;

module.exports.getUsers = getUsers;
module.exports.getUserProfile = getUserProfile;
module.exports.getCatlogForUser = getCatlogForUser;

//module.exports.test1 = test1;


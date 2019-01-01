/* File name: MySwapsController.js
 * Description: Controller for the 'mySwaps' page
 */

var express = require('express');
var item = require('../models/item.js');
var userDB = require('../models/UserDB');
var offerDB = require('../models/OfferDB');
var profileCntl = require('./ProfileController.js');
var catalogCntl = require('./CatalogController.js');

var path = require('path');
var app = express();

var router = express.Router();


app.set('view engine', 'ejs');

app.set('views',path.join(__dirname,'../views'));
app.set('views/partial',path.join(__dirname,'../views/partial'));
app.use('/resources', express.static('../resources'));

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var urlEncodedParser = bodyParser.urlencoded({extended : false});


 var MySwapsController = async function(req, res){

    console.log("In MySwapsController");

    /* input validation of the itemCode  */
    req.checkQuery('itemCode', "Enter a valid item code.")
    .optional()
    .isNumeric() 
    .isLength({ max: 20 })

    if(req.session.theUser === undefined){
        /* if user is not logged in then open up the login page */
        error_msg = 'Please login for this functionality'
        res.render('login');
        return
        //await profileCntl.NewUserLogin(req);
    }
    var theUser = req.session.theUser

    var userID = theUser.userID;

    var userProfObj = await userDB.getUserProfile(userID);
    var userItem = userProfObj.getAllItemsOfUser();

    var userReqSwaps = await offerDB.getOffersByUser(userID);
    console.log("userReqSwaps:",userReqSwaps);

    var othersReqSwaps = await offerDB.getOffersToUser(userID);
    console.log("othersReqSwaps", othersReqSwaps);

     var userReqItem2D = [];

    var userReqItem2D = new Array(userReqSwaps.length);

for (var i = 0; i < userReqSwaps.length; i++) {
  userReqItem2D[i] = new Array(3);

  itemCodeOwn = userReqSwaps[i].itemCodeOwn;
  itemCodeWant = userReqSwaps[i].itemCodeWant;

userReqItem2D[i][0] = await item.getItem(itemCodeOwn);
userReqItem2D[i][1] = await item.getItem(itemCodeWant);

userReqItem2D[i][2] = userReqSwaps[i].itemStatus;

}
/*
console.log("itemOwn")
console.log(userReqItem2D[0][0])
console.log(userReqItem2D[0][0].itemName)
console.log(userReqItem2D[0][0].itemCode)
console.log("itemWant")
console.log(userReqItem2D[0][1])
console.log(userReqItem2D[0][1].itemName)
console.log(userReqItem2D[0][1].itemCode)
console.log("itemStatus")
console.log(userReqItem2D[0][2])
*/
     // iterate over the userReqSwaps & fetch the corresponding user's item obj & requested item obj
     // insert this to a 2 D array of obj


     var othersReqItem2D = [];

    var othersReqItem2D = new Array(othersReqSwaps.length);

for (var i = 0; i < othersReqSwaps.length; i++) {
  othersReqItem2D[i] = new Array(3);

  itemCodeOwn = othersReqSwaps[i].itemCodeOwn;
  itemCodeWant = othersReqSwaps[i].itemCodeWant;

  othersReqItem2D[i][0] = await item.getItem(itemCodeOwn);
  othersReqItem2D[i][1] = await item.getItem(itemCodeWant);

othersReqItem2D[i][2] = othersReqSwaps[i].itemStatus;

}    
/*
console.log("others itemOwn")
console.log(othersReqItem2D[0][0])
console.log(othersReqItem2D[0][0].itemName)
console.log(othersReqItem2D[0][0].itemCode)
console.log("others itemWant")
console.log(othersReqItem2D[0][1])
console.log(othersReqItem2D[0][1].itemName)
console.log(othersReqItem2D[0][1].itemCode)
console.log("others itemStatus")
console.log(othersReqItem2D[0][2])
*/

    res.render('mySwaps',{userProf: req.session.currentProfile, itemList:userItem,
        userReqItem2D:userReqItem2D, othersReqItem2D:othersReqItem2D
    });


};    



module.exports.mySwapsController = MySwapsController;

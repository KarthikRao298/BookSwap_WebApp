/* File name: ProfileController.js
 * Description: 
 */

var express = require('express');
var item = require('../models/item.js');
var userDB = require('../models/UserDB');


var path = require('path');
var app = express();
var crypto = require('crypto'); 


var router = express.Router();


app.set('view engine', 'ejs');

app.set('views',path.join(__dirname,'../views'));
app.set('views/partial',path.join(__dirname,'../views/partial'));
app.use('/resources', express.static('../resources'));

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var urlEncodedParser = bodyParser.urlencoded({extended : false});

/*
 * over ride the console log method
 
var log = console.log;
console.log = function() {
    log.apply(console, arguments);
    // Print the stack trace
    //console.trace();
};

function thisLine() {
  const e = new Error();
  const regex = /\((.*):(\d+):(\d+)\)$/
  const match = regex.exec(e.stack.split("\n")[2]);
  return {filepath: match[1],line: match[2]};
}
*/

_log = console.log;
global.console.log = function() {
    var traceobj = new Error("").stack.split("\n")[2].split(":");
    var file = traceobj[0].split(process.env.PWD + '/')[1];
    var line = traceobj[1];
    var new_args = [file + ":" + line + " >>"];
    new_args.push.apply(new_args, arguments);
    _log.apply(null, new_args);
};

/*
 * myitems page
 

router.get('/myItems', function(req,res){
    console.log(req.query);
  req.session.theUser = theUser;


    res.render('myItems');
});
 */

/* app.post & using urlencodedparser is more secure than app.get */
//router.post('/myItems', urlEncodedParser, function(req, res){

 var ProfileController = async function(req, res){

    var theUser = req.session.theUser;
    var theItem = req.query.theItem;

    var theUserList = await userDB.getUsers();
    /* TBD: use  hiddenItemList */
    var hiddenItemList = [];
    var currentProfile = null;

    /* input validation of the itemCode & action */
    req.checkQuery('action', "Enter a valid action")
    .isAlpha()
    .isLength({ max: 10 })
    .isIn(['signIn','signout','update','accept','reject','withdraw','offer','delete'])
    .optional();

    req.checkQuery('itemCode', "Enter a valid item code.")
    .optional()
    .isNumeric() 
    .isLength({ max: 20 })

     var errors = req.validationErrors();
        if (errors) {
        //res.send(errors[0].msg); // to print specific error message
            //res.send(errors);
            console.log('Invalid action or user not logged in')
            error_msg = errors[0].msg
            console.log(error_msg);
            //res.redirect('/login?error_msg=' + error_msg);

            res.render('index');
            return
        }

    if(theUser === undefined && req.query.action === 'signIn' ){
    /*
    If there is no user attribute:
     - create a User object, by selecting the first (or random) user from the UserDB.
     - add the User object to the current session as “theUser”
     - get the user profile items 
     - add the user profile to the session object as “currentProfile” and dispatch to
    the profile view
    */

        console.log("SignIn action selected");

        req.checkBody('username', "Enter a valid email address.")
        .isEmail()
        .normalizeEmail()
        .notEmpty();

        req.checkBody('pswd', "Enter a valid password")
        .isAlphanumeric()
        .isLength({ max: 20 })
        .notEmpty();

        var errors = req.validationErrors();
        if (errors) {
        //res.send(errors[0].msg); // to print specific error message
            //res.send(errors);
            console.log('Invalid login credentials entered')
            error_msg = errors[0].msg
            //res.redirect('/login?error_msg=' + error_msg);

            res.render('login' , {error_msg:error_msg});
            return
        }

        var status = await NewUserLogin(req, res);
        if (status === undefined){
            error_msg = "Invalid login credentials entered!"
            console.log(error_msg)
            //res.redirect('/login?error_msg=' + error_msg);
            res.render('login' , {error_msg:error_msg});
            return
        }

        res.render('myItems',{userProf: req.session.currentProfile});

    }else if ( theUser === undefined ){

            console.log('User not logged in')
            //res.redirect('/login');
            error_msg = 'Please login for this functionality'
            res.render('login' , {error_msg:error_msg});



    }else if ( IsUserValid (theUser,theUserList) ){

        var userID = theUser.userID;
        //console.log( "Current user session:", theUser, theUser.userID);

        var userProfObj = await userDB.getUserProfile(userID);
        theItem = req.query.theItem;
        var userItem = userProfObj.getUserItem(theItem);
        currentProfile = req.session.currentProfile;


        console.log( "Current user session is valid");
        var userReqParams = req.body;

        if (req.query.action === 'update'){
            console.log("Update action selected, theItem=",theItem);

            /* validate current item code */
            if (await IsItemCodeValid(req.query.theItem, theUser, hiddenItemList)){

                if(userItem.status === 'pending'){
                    console.log("item status is pending, redirecting to mySwaps");
                    req.swapItem = userItem;
                    res.redirect('/mySwaps');

                } else if (userItem.status === 'available' || userItem.status === 'swapped'){
                    /* add the UserItem object to the request as “userItem” & 
                     * dispatch to the individual item view
                     */
                    console.log("item status is available/swapped");
                    console.log(userItem.item);
                    req.userItem = userItem.item; 
                    res.redirect('/item?itemCode=' + theItem);



                }
            } else {

                console.log( "[ERROR] IsItemCodeValid == false");

                /* TBD: item does not validate or does not exist in the user profile
                    dispatch to the profile view */
                res.render('myItems',{userProf: req.session.currentProfile});
            }

        } else if (req.query.action === 'accept' || req.query.action === 'reject' || req.query.action === 'withdraw'){
            console.log("accept action/reject/withdraw selected");

            if (await IsItemCodeValid(req.query.theItem, theUser, hiddenItemList)){

                if(userItem.status === 'pending'){
                    console.log("status is pending");


                    if (req.query.action === 'reject' || req.query.action === 'withdraw' ){
                        /* If action was “reject” or “withdraw” reset the status value to
                        indicate that this item is available for swap and clear the value
                        for the swap status property */
                        console.log("status is reject/withdraw");
                        userItem.status = 'available';
                        //userDB.updateUserProfile(theUser,req.query.theItem,userItem);
                        userProfObj.UpdateUserProfile(userItem);

                    } else if (req.query.action === 'accept'){
                        /* If action was “accept” set the status value to indicate that this
                        item was swapped */
                        console.log("status is swapped");

                        userItem.status = 'swapped';
                        //console.log("current profile: ",currentProfile);

                        userProfObj.UpdateUserProfile(userItem);

                        console.log("status is swapped");

                    }

                    currentProfile = await userDB.getUserProfile(theUser.userID);
                    req.session.currentProfile = currentProfile;

                    //console.log("updated profile: ",currentProfile);

                    res.render('myItems',{userProf: req.session.currentProfile});
                } else{

                    console.log("status is not pending!");
                    res.render('myItems',{userProf: req.session.currentProfile});                                        
                }

            } else {
                /* TBD: item does not validate or does not exist in the user profile
                    dispatch to the profile view */

                console.log("[ERROR] IsItemCodeValid == false");
                res.render('myItems',{userProf: req.session.currentProfile});
            }


        } else if (req.query.action === 'offer'){
            console.log("offer action selected");

            if (await IsItemCodeValid(req.query.theItem, theUser, hiddenItemList)){

                if (userProfObj.IsItemsForSwapAvailable()){

                    console.log("Items available for swapping");

                    /* add the available items to the request and dispatch to the swap
                    item view */
                    var availableItems = [];
                    availableItems = userProfObj.GetAvailableItems();

                    res.render('mySwaps',{userProf: req.session.currentProfile, itemList: availableItems});

                } else{
                    /* TBD: add a message to the request indicating that to the user. (Sorry,
                    you do not have any available items for swapping. Please add
                    more items to start swapping again!)
                    dispatch back to the individual item view displaying the
                    message and the item.
                    */
                    console.log("No items available for swapping!");
                    req.session.message = "No items available for swapping!";
                    res.render('categories',{data: req.session.currentProfile, message:req.session.message});

                }
            } else {
                /* TBD: item does not validate or does not exist in the user profile
                    dispatch to the profile view */
                console.log( "[ERROR] IsItemCodeValid == false");
                
                res.render('myItems',{userProf: req.session.currentProfile});
            }



        } else if (req.query.action === 'delete'){
            console.log("delete action selected");

            if (await IsItemCodeValid(req.query.theItem, theUser, hiddenItemList)){
                /* 
                - if the item validates and exists in the user, remove this item from the
                user profile
                - having an updated profile, add the updated profile to the session object
                as “sessionProfile” and dispatch to the profile view
                */ 
                //console.log("currentProfile:",req.session.currentProfile);

                /* TBD: check return value*/
                await userProfObj.removeUserItem(req.query.theItem);
                //console.log("item deleted. currentProfile",userProfObj);
                req.session.sessionProfile = await userDB.getUserProfile(theUser.userID);
                //console.log("item deleted. currentProfile", req.session.sessionProfile);
                res.render('myItems',{userProf: req.session.sessionProfile});

            } else {
                /* TBD: item does not validate or does not exist in the user profile
                    dispatch to the profile view */
                console.log( "[ERROR] IsItemCodeValid == false");
                res.render('myItems',{userProf: req.session.currentProfile});
            }


        } else if (req.query.action === 'signout'){
            console.log("signout action selected.User has been signed out");
            /* Clear the session and dispatch to the categories/catalog view */
            req.session.theUser = undefined;
            //userProfObj.emptyProfile(); TBD: not sure if this is needed here
    
            var itemsList = await item.getItems();
            var categoriesList  = await item.getCategoriesList();
            error_msg = null
            res.locals.login = false;
            res.render('categories',{categoriesList:categoriesList,itemsList:itemsList, error_msg:error_msg});

        } else if (req.query.action === 'signIn'){
            console.log("signIn action selected, but user is already logged in!");
            /* display the list of items belonging to the user */
            res.render('myItems',{userProf: req.session.currentProfile});

            
        } else {
            /* TBD: if there is no action parameter, or if it has an unknown value, dispatch to the
            profile view. If this is a new user and no items are added to their profile this
            page should be empty (you can display a message indicating that there no
            items to display)
            */
            console.log("No action selected");
            res.render ('myItems',{userProf: userProfObj});
        }

        
    } else {

        console.log("Error in capturing user session");
        res.render('myItems',{userProf: req.session.currentProfile});
                    


    }
};

var IsUserValid = function(theUser, theUserList){
    /* checks if the user is available in the list of users in the DB */
    //console.log("theUser: ",theUser);
    //console.log("theUserList: ",theUserList);
    for (var i=0; i<theUserList.length; i++){

        if (JSON.stringify(theUser) === JSON.stringify(theUserList[i]) ){
            return true;
        }
    }
    return false;
};

var IsItemCodeValid = async function(theItem, theUser, hiddenItemList){
    /* TBD: 1. use hiddenItemList 
            2. check in suitable user list rather than the complete DB
     */
    var status = false;
    var itemFound = false;
    var allItems = [];

    userID = theUser.userID;
    var userProfObj = await userDB.getUserProfile(userID);

    allItems = userProfObj.getAllItemsOfUser();

    for (var i=0; i<allItems.length && (theItem !== undefined); i++){
        if (allItems[i].itemID === theItem.itemID){
            itemFound = true;
        }
    }

    if ((theItem !== undefined) && (await item.getItem(theItem) !== null) && itemFound) {

        console.log("[IsItemCodeValid] item found in DB");
        status = true;
    }
    return status;
}

/*
 * NewUserLogin
 * Description : This method logins a new user
 * TBD: Currently a place holder. Needs to be in utility file
 */
var NewUserLogin = async function(req, res){

    // create a User object, by selecting the first (or random) user from the UserDB.
    // TBD: remove this
    //var theUserList = await userDB.getUsers();
    //var theUser = theUserList[0];
    var success = false;
    //console.log(req.body.username);
    //console.log(req.body.pswd)



    theUser = await userDB.getUser(req.body.username, req.body.pswd);
    //console.log(theUser.password)
/*
    pswdStatus = bcrypt.compareSync(req.body.pswd, theUser.password);
    console.log(pswdStatus)    console.log(pswdStatus)

    pswdStatus = isPasswordCorrect(savedHash, theUser.password.savedSalt, theUser.password.savedIterations, req.body.pswd)
    console.log(pswdStatus)
*/

    if (theUser !== undefined){

        req.session.theUser = theUser
        //console.log(theUser);

        currentProfile = await userDB.getUserProfile(theUser.userID)
        req.session.currentProfile = currentProfile;
        res.locals.login = true;

        console.log("New user session! profile:");
        return theUser;

    } else {
        return undefined;
    }
    //console.log(currentProfile);

}

function isPasswordCorrect(savedHash, savedSalt, savedIterations, passwordAttempt) {
    return savedHash === crypto.pbkdf2(passwordAttempt, savedSalt, savedIterations, 10, `sha512`).toString(`hex`); ;
}

module.exports.profileController = ProfileController;
module.exports.IsUserValid = IsUserValid;
module.exports.NewUserLogin = NewUserLogin;


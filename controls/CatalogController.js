/* File name: CatalogController.js
 * Description: 
 */

var express = require('express');
var item = require('../models/item.js');
var userDB = require('../models/UserDB');

var profileCntl = require('./ProfileController.js');

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

/* TBD: include this in a util file
_log = console.log;
global.console.log = function() {
    var traceobj = new Error("").stack.split("\n")[2].split(":");
    var file = traceobj[0].split(process.env.PWD + '/')[1];
    var line = traceobj[1];
    var new_args = [file + ":" + line + " >>"];
    new_args.push.apply(new_args, arguments);
    _log.apply(null, new_args);
};
*/

var catalogController = async function(req, res) {
  console.log("Inside catalog controller", req.url)


        /*
         * Perform input validation of the itemCode & the catalogCategory
         * and display all items in case of any validation errors
         */
        var error_msg = null;
        loginParams = req.query;
        //console.log(loginParams.itemCode);
        //console.log(loginParams.catalogCategory);

        req.checkQuery('itemCode', "Enter a valid item code.")
        .optional()
        .isAlphanumeric()        
        .isLength({ max: 20 })

        req.checkQuery('catalogCategory', "Enter a valid catalog category")
        .isAlpha()
        .optional()
        .isLength({ max: 20 })

        var errors = req.validationErrors();
        if (errors) {
            console.log('Invalid itemCode/catalogCategory entered. Displaying all items')
            error_msg = errors[0].msg

            var itemsList = await item.getItems();
            var categoriesList  = await item.getCategoriesList();
            var categoriesListToDisplay = [];
            categoriesListToDisplay = await item.getCategoriesList();
         res.render('categories',{categoriesList:categoriesListToDisplay,itemsList:itemsList, 
          error_msg: error_msg});
            return
        }



    // displays catalog when no parameter is passed
    if(req.url == '/categories'){
      //if user info is present in session
      //check is user is present in session
      if(req.session.theUser){
        console.log(" user info is present in session")
        //check if user is valid
        if( profileCntl.IsUserValid(req.session.theUser, await userDB.getUsers()) ){
          // user is valid
          console.log("user is valid")
          //load all the items which are not present in current users' list
          var catalogListForCurrentUser = await userDB.getCatlogForUser(req.session.theUser.userID)
          var itemsList = await item.getItems();
          var categoriesList  = await item.getCategoriesList();
          error_msg = null;
          res.render('categories',{categoriesList:categoriesList,itemsList:catalogListForCurrentUser,
              error_msg:error_msg});

        } else{
                    //TBD: user is not valid

            console.log("Invalid user")
          res.send("Invalid User")
        }
      } else if(isEmpty(req.query)){
                //load a catalog that doesn’t include any of the active user’s items.
            console.log("No user session found. Displaying all items")

        var itemsList = await item.getItems();
        var categoriesList  = await item.getCategoriesList();
              var categoriesListToDisplay = [];
      categoriesListToDisplay = await item.getCategoriesList();

        //console.log("*** query is empty.",categoriesList,itemsList)

        //res.render('categories',{categoriesList:categoriesList,itemsList:itemsList});
        res.render('categories',{categoriesList:categoriesListToDisplay,itemsList:itemsList,
          error_msg:error_msg
        });

      }
    } else if(!isEmpty(req.query.itemCode)){
          // displays catalog when itemCode is passed

                console.log("ItemCode is not empty")

      //if itemCode is format is valid and its is present in the catalog : redirect to item page
      if((await item.isItemPresent(req.query.itemCode))){
        console.log("Item is present")

          //fetch item  object for corresponding to code
          var itemToDisplay = await item.getItem(req.query.itemCode);
          //render the view for the item and pass the retrieved data
//          res.render('/item',{item:itemToDisplay});
          res.redirect('/item?itemCode=' + req.query.itemCode);
      } else{
        error_msg = 'Item not found!'
        console.log(error_msg)
        var itemsList = await item.getItems();
        var categoriesList  = await item.getCategoriesList();
        res.render('categories',{categoriesList:categoriesList,itemsList:itemsList, error_msg:error_msg});
      }

    } else if(!isEmpty(req.query.catalogCategory)){

    // display catalog when catalogCategory is not empty


      var itemsList = await item.getItems();
      var categoriesList  = await item.getCategoriesList();
      var categoriesListToDisplay = [];

                    //  console.log("catalogCategory is not empty. categoriesList:",categoriesList)

      //if catalogCategory values matches format and is valid then
      if(categoriesList.includes(req.query.catalogCategory)){
                console.log("valid category")

         categoriesListToDisplay[0] = req.query.catalogCategory;
        res.render('categories',{categoriesList:categoriesListToDisplay,itemsList:itemsList});
      } else{
              //else display all the categories
                        console.log("Invalid category!")
        var itemsList = await item.getItems();
        var categoriesList  = await item.getCategoriesList();
        res.render('categories',{categoriesList:categoriesList,itemsList:itemsList});
      }
    } else{
            // handles other cases
      console.log("Invalid url entered!")

      res.send('Invalid url entered!')
    }

}

var isEmpty =  function (obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


/*
var catalogController = function(req, res) {


    var theUser = req.session.theUser;
    var theItem = req.query.theItem;

    var theUserList = userDB.getUsers();
    // TBD: use  hiddenItemList 
    var hiddenItemList = [];
    var currentProfile = null;

    if(theUser === undefined){
        // loading the complete catalog and ending with either displaying the complete
        //catalog or an individual item view
        


    } else if (){
        //oad a catalog that doesn’t include any of the
        //active user’s items.

    }
};
*/
module.exports.catalogController = catalogController

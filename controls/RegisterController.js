/* File name: RegisterController.js
 * Description: Controller for the registration page
 * 
 */

var crypto = require('crypto'); 

var express = require('express');
var item = require('../models/item.js');
var userDB = require('../models/UserDB');
var offerDB = require('../models/OfferDB');
var profileCntl = require('./ProfileController.js');
var catalogCntl = require('./CatalogController.js');
var loginCntl = require('./LoginController.js');

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


var RegisterController = async function(req, res){

    console.log("In RegisterController");
    var error_msg = null;


    if (req.query.action === 'signUp'){
        console.log("Sign Up action selected");

        req.checkBody('inFirstName', "Enter a valid first name")
        .isAlpha()
        .isLength({ max: 20 })
        .notEmpty();

        req.checkBody('inLastName', "Enter a valid lst name")
        .isAlpha()
        .isLength({ max: 20 })
        .notEmpty();

        req.checkBody('inEmail', "Enter a valid email address.")
        .isEmail()
        .normalizeEmail()
        .notEmpty();



        req.checkBody('inCity', "Enter a valid city ")
        .isAlpha()
        .isLength({ max: 20 })
        .notEmpty();

        req.checkBody('inPostalCode', "Enter a valid postal code")
        .isNumeric()
        .isLength({ max: 20 });

        req.checkBody('inPassword', "Enter a valid password")
        .isAlphanumeric()
        .isLength({ max: 20 })
        .notEmpty();

        var errors = req.validationErrors();
        if (errors) {
            console.log('Invalid registration data entered')
            error_msg = errors[0].msg
            res.render('register' , {error_msg:error_msg});
            return
        }

        console.log(req.body.inUserId);
        console.log(req.body.inFirstName);
        console.log(req.body.inLastName);
        console.log(req.body.inEmail);
        console.log(req.body.inCity);
        console.log(req.body.inState);
        console.log(req.body.inPostalCode);
        console.log(req.body.inCountry);
        console.log(req.body.inPassword);

        console.log(req.body.inAddress1);
        console.log(req.body.inAddress2);

        theUser = await userDB.isUserExist(req.body.inEmail);

        if (theUser === undefined){
        console.log("New user registered");

        /* salt & hash the password 
        var hashPassword = bcrypt.hashSync(req.body.inPassword, res.locals.saltRounds);
        console.log(req.body.inPassword)
        console.log(hashPassword)
        
            var salt = crypto.randomBytes(128).toString('base64');
            var iterations = 10000;
            var hash = crypto.pbkdf2Sync(req.body.inPassword, salt, iterations, 10, `sha512`).toString(`hex`); 

        var hashPassword = {
                "salt": salt,
                "hash": hash,
                "iterations": iterations
            };
        */




        /* add new user to the DB*/
        await userDB.addUser(req.body.inUserId, req.body.inFirstName, req.body.inLastName, req.body.inEmail, req.body.inAddress1, req.body.inAddress2,
                 req.body.inCity, req.body.inState, req.body.inPostalCode, req.body.inCountry,
                 req.body.inPassword);

        theUser = await userDB.getUser(req.body.inEmail, req.body.inPassword);

        /* assign the user to the user session */
        req.session.theUser = theUser
        console.log(theUser);
        currentProfile = await userDB.getUserProfile(theUser.userID)
        req.session.currentProfile = currentProfile;
        res.locals.login = true;



        res.redirect('categories');

        } else {
            error_msg = "You have already signed up! Please login"
            res.render('login',{error_msg: error_msg});
        }

    } else {
        console.log("No action selected");
        //error_msg = "Please enter valid information"
        res.render('register',{error_msg: error_msg});

    }




}


module.exports.registerController = RegisterController;

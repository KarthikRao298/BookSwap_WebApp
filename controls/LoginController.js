/* File name: LoginController.js
 * Description: Controller for the 'signin' page & registration page
 * 
 * TBD: this controller may not be needed, if the functionality can be included in the app.js 
 */

var express = require('express');
var item = require('../models/item.js');
var userDB = require('../models/UserDB');
var offerDB = require('../models/OfferDB');
var profileCntl = require('./ProfileController.js');
var catalogCntl = require('./CatalogController.js');
var catalogCntl = require('./RegisterController.js');


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


var LoginController = async function(req, res){

    console.log("In LoginController");
    var error_msg = null;
    res.render('login',{error_msg: error_msg});

}


module.exports.loginController = LoginController;

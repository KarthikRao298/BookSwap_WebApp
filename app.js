/*
 * file name: app.js
 *
 */

var express = require('express');
var itemDB = require('./models/itemDB');
var item = require('./models/item');

var userDB = require('./models/UserDB');
var user = require('./models/User');

var path = require('path');
var app = express();


var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var crypto = require('crypto'); 

var session = require('express-session');
var profileCntl = require('./controls/ProfileController.js');
var catalogCntl = require('./controls/CatalogController.js');
var myswapCntl = require('./controls/MySwapsController.js');
var loginCntl = require('./controls/LoginController.js');
var registerCntl = require('./controls/RegisterController.js');


var router = express.Router();

app.set('view engine', 'ejs');

app.set('views',path.join(__dirname,'./views'));
app.set('views/partial',path.join(__dirname,'./views/partial'));

/* salting & hashing passwords 
const bcrypt = require('bcrypt');
const res.locals.saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
*/


app.use(session({secret:'this-is-a-secret-token', cookie:{maxAge:60000}}));

/* connect to mongo db */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/book_swap_db');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var urlencodedParser = bodyParser.urlencoded({extended: false});

var validator = require('express-validator');
const { check, oneOf, validationResult } = require('express-validator/check');
app.use(validator());

// helmet secures apps by setting various HTTP headers
const helmet = require('helmet')
app.use(helmet());
// set X-XSS-Protection header
app.use(helmet.xssFilter());
// set X-Content-Type-Options header
app.use(helmet.noSniff());
// set X-Frame-Options header
app.use(helmet.frameguard());
// improve security by disabling X-Powered-By header
app.disable('x-powered-by');

/* A middleware to toggle the display of the login/logout button */
app.use(function (req, res, next) {
    /* */
    if (req.session.theUser === undefined){
        res.locals.login = false;
    } else {
        res.locals.login = true;
    }
    next();
});

app.use('/resources', express.static('./resources'));

app.get('/myItems',profileCntl.profileController);
app.get('/categories',catalogCntl.catalogController);
app.get('/mySwaps',myswapCntl.mySwapsController);
app.get('/login',loginCntl.loginController);
app.get('/register', registerCntl.registerController);

/*
 * Post method to handle user login inputs 
 */
app.post('/myItems', urlencodedParser, function (request, response) {
    profileCntl.profileController(request, response);
});

/*
 * Post method to handle first time user sign up inputs 
 */
app.post('/register', urlencodedParser, function (request, response) {
    registerCntl.registerController(request, response);
});


/*
 * item page
 */ 
app.get('/item', async function(req,res){


    req.checkQuery('itemCode', "Enter a valid item code.")
    .optional()
    .isNumeric() 
    .isLength({ max: 20 })

    var errors = req.validationErrors();

    var itemObj = await item.getItem(req.query.itemCode);
        
    if(req.query.itemCode !== undefined && itemObj !== null && !errors){
        console.log('itemCode is not null. itemCode=',req.query.itemCode);

        console.log(itemObj);
        res.render('item',{item: itemObj});

    } else {
        var error_msg = 'Item code is invalid'
        console.log('item code is undefined/null hence redirecting to categories');
        res.redirect("/categories");
        //res.render('categories', {error_msg:error_msg})
    }

});

/*
 * swap page
 */
app.get('/swap', async function(req,res){

// TBD: many use cases are to be handled here

    /* input validation of the itemCode & the action */
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

    if(req.query.itemCode !== null && req.query.itemCode !== undefined){
        console.log('itemCode is not null. itemCode=',req.query.itemCode);

        var itemObj = await item.getItem(req.query.itemCode);
        //var item    = item.getItem(req.query.itemCode);
    }
    if(itemObj !== null && itemObj !== {}){

    var theUser = req.session.theUser

    var userID = theUser.userID;

    var userProfObj = await userDB.getUserProfile(userID);

        res.render('swap', {item: itemObj, userProf: req.session.currentProfile, });   

    } else {
        console.log("itemCode is invalid. redirecting to categories.");
        res.render('categories',{categoriesList:categoriesList,itemsList:itemsList});
    }

});


/*
 * about page
 */ 
app.get('/about', async function(req,res){
    console.log(req.query);
    res.render('about');
});

/*
 * contact page
 */ 
app.get('/contact', async function(req,res){
    console.log(req.query);
    res.render('contact');
});

/*
 * rate item page
 */ 
app.get('/rateItem', async function(req,res){
    console.log(req.query);


    req.checkQuery('itemCode', "Enter a valid item code.")
    .optional()
    .isNumeric() 
    .isLength({ max: 20 })

    var errors = req.validationErrors();
    if(req.session.theUser === undefined){
        /* if user is not logged in then open up the login page */
        error_msg = 'Please login for this functionality'
        res.redirect('login');
        return
        //await profileCntl.NewUserLogin(req);
    }
    var itemObj = await item.getItem(req.query.itemCode);
        
    if(req.query.itemCode !== undefined && itemObj !== null && !errors){
        console.log('itemCode is not null. itemCode=',req.query.itemCode);

        console.log(itemObj);
        res.render('rateitem',{item: itemObj});

    } else {
        var error_msg = 'Item code is invalid'
        console.log('item code is undefined/null hence redirecting to categories');
        res.redirect("/categories");
        //res.render('categories', {error_msg:error_msg})
    }

});

app.post('/rateItem', async function(req,res){
    console.log(req.query);

    req.checkQuery('itemRate', "Enter a valid item code.")
    .isNumeric()
    .optional()
    .isLength({ max: 1 })

    /* after the item has been rated redirect to categories*/
    console.log("redirecting to categories.");
    res.redirect("/categories");

});

/*
 * rate swapper page
 */ 
app.get('/rateSwapper', async function(req,res){
    console.log(req.query);


    req.checkQuery('itemCode', "Enter a valid item code.")
    .optional()
    .isNumeric() 
    .isLength({ max: 20 })

    var errors = req.validationErrors();
    if(req.session.theUser === undefined){
        /* if user is not logged in then open up the login page */
        error_msg = 'Please login for this functionality'
        res.render('login');
        return
        //await profileCntl.NewUserLogin(req);
    }
    var itemObj = await item.getItem(req.query.itemCode);
        
    if(req.query.itemCode !== undefined && itemObj !== null && !errors){
        console.log('itemCode is not null. itemCode=',req.query.itemCode);

        console.log(itemObj);
        res.render('rateSwapper',{item: itemObj});

    } else {
        var error_msg = 'Item code is invalid'
        console.log('item code is undefined/null hence redirecting to categories');
        res.redirect("/categories");
    }

});

app.post('/rateSwapper', async function(req,res){
    console.log(req.query);

    /* after the swapper has been rated redirect to categories*/
    console.log("redirecting to categories.");
    res.redirect("/categories");

});

/*
 * index page
 */ 
app.get('/index', async function(req,res){

    console.log(req.query);
    //userId = '521'; // test itemCode
    //userProfObj = await userDB.getCatlogForUser(userId);
    //    console.log(userProfObj);
    //    console.log(typeof(userProfObj));
        //console.log(userProfObj.userItems[0].item.itemCode);

        //status = userProfObj.IsItemsForSwapAvailable()
        //console.log("status", status)
        res.render('index');        
});

/*
 * default page
 */ 
app.get('/*', function(req,res){
    console.log("rendering default page");
    res.render('index');  
});

 
app.listen(8080);


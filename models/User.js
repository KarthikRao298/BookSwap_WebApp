/* File name: User.js
 * Description: file with the user class
 */

var mongoose = require('mongoose');


var User = function (userID, firstName, lastName, emailAddress, address1Field, address2Field,
 city, state, postalCode, country, password){

    var userObj = {
        userID: userID,
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        address1Field: address1Field,
        address2Field: address2Field,
        city: city,
        state: state,
        postalCode: postalCode,
        country: country,
        password: password

    };

    return userObj;
};

/* schema for the user */
var userSchema = new mongoose.Schema({
  
        userID: {type: String, required:true, unique:true},
        firstName: {type: String, required:true},
        lastName: String,
        emailAddress: String,
        address1Field: String,
        address2Field: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        password: String

},{collection:'user'});

var userModel = mongoose.model ('user', userSchema);

module.exports.userModel = userModel;
module.exports.User = User;

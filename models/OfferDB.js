/*
 * OfferDB
 */

var mongoose = require('mongoose');

/*
 * schema for 'offer' collection
 */
var offersSchema = new mongoose.Schema({
  
        userId: {type: String, required:true},
        itemCodeOwn: {type: String, required:true},
        itemCodeWant: {type: String, required:true},
        itemUserId: {type: String, required:true},        
        itemStatus: {type: String, required:true}

},{collection:'offers'});

var offersModel = mongoose.model ('offers', offersSchema);

/*
 * 
 * addOffer(userID, itemCodeOwn, itemCodeWant, itemStatus):
 * this method adds an offer to the database. The userID here refers to the user that is 
 * making the offer and itemCodeOwn is 
 * the itemCode that this user owns and itemCodeWant is the item code they would like to get.
 * TBD: test this
 */
function addOffer (userId, itemCodeOwn, itemCodeWant, itemUserId, itemStatus) {
    console.log("[addOffer]  "+userId+" "+itemCodeOwn+" "+itemCodeWant+" "+itemUserId+" "+itemStatus);
    return new Promise((resolve, reject) => {
    
        var newOffer = new offersModel({
            userId: userId,
            itemCodeOwn: itemCodeOwn,
            itemCodeWant: itemCodeWant,
            itemUserId: itemUserId,
            itemStatus: itemStatus
        });

        newOffer.save().then(docs =>{
        resolve(docs);
        }).catch(err => {
            return reject(err);
        })
    });
}

/*
 * updateOffer(offerID, itemStatus)
 * this method updates the status of the offer in the database.
 * TBD: test this 
 */
function updateOffer (offerId, itemStatus) {
    return new Promise((resolve, reject) => {
        offersModel.findOneAndUpdate({"_id":offerId},{"itemStatus":itemStatus},{new: true}).then(docs =>{
            console.log("[updateOffer] - "+docs);
            resolve(docs);
        }).catch(err => {
            return reject(err);
        })
    })
}

/*
 * getOffersByUser()
 * this function returns the offers made by the user
 */ 
function getOffersByUser (userId) {
    return new Promise((resolve, reject) => {

        offersModel.find({"userId": userId, "itemStatus": {$eq: 'pending'}}).then(docs => {
            resolve (docs);
        }).catch(err => {
            console.error(err);
        })

    })
}

/*
 * getOffersToUser()
 * this function returns the offers made to the user by others
 */ 
function getOffersToUser (userId) {
    return new Promise((resolve, reject) => {

        offersModel.find({"itemUserId": userId, "itemStatus": {$eq: 'pending'}}).then(docs => {
            resolve (docs);
        }).catch(err => {
            console.error(err);
        })

    })
}


module.exports.getOffersByUser = getOffersByUser;
module.exports.getOffersToUser = getOffersToUser;
module.exports.addOffer = addOffer;
module.exports.updateOffer = updateOffer;
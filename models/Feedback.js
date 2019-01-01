/*
 * File name: FeedbackDB
 */


/*
 * schema for 'feedback' collection
 * offerId, userId1, userId2, userRating, itemCode, itemRating
 */
var feedbackSchema = new mongoose.Schema({
  
    offerId: String,
    userId1: {type: String, required:true},
    userId2: {type: String, required:true},
    userRating: {type: String, required:true},
    itemCode: {type: String, required:true}
    itemRating: {type: String, required:true}

},{collection:'feedback'});

var feedbackModel = mongoose.model ('feedback', offersSchema);

/* addOfferFeedback(offerID, userID1, userID2, rating)
 * this method adds a feedback that user with userID1 is giving for user with userID2. 
 * Both users have completed a swap. Using the offerID we can verify and link this to an offer.
 * The corresponding database table would use the offerID and userID1 as primary keys.
 * TBD: test this 
 */
function addOfferFeedback (offerId, userId1, userId2, rating){
    console.log("[addOfferFeedback]  "+offerId+" "+userId1+" "+userId2+" "+rating);
    return new Promise((resolve, reject) => {
    
        var newFeedback = new feedbackModel({

            offerId: offerId
            userId1: userId1
            userId2: userId2
            userRating: rating
            itemRating: null
        });

        newFeedback.save().then(docs =>{
        resolve(docs);
        }).catch(err => {
            return reject(err);
        })
    });
}

/* addItemFeedback(itemCode, userID, rating)
 * this method adds a feedback that user with userID is giving for item with itemCode.
 * The corresponding database table would use the userID and itemCode as primary keys.
 * TBD: test this  
 */

function addItemFeedback (itemCode, userID, rating){

    return new Promise((resolve, reject) => {
        // TBD: verify if this is correct
        feedbackModel.findOneAndUpdate({"itemCode":itemCode, "userId1":userId1},
            {"itemRating":itemRating}).then(docs =>{
            console.log("[addItemFeedback] - "+docs);
            resolve(docs);
        }).catch(err => {
            return reject(err);
        })
    })    
}

 module.exports.addItemFeedback = addItemFeedback;
 module.exports.addOfferFeedback = addOfferFeedback;

var item = require('./itemDB.js')
var mongoose = require('mongoose');
var async = require('async');


/*
 * item schema

*/
var itemSchema = new mongoose.Schema({
  
        itemCode: {type: String, required:true, unique:true},
        itemName: {type: String, required:true},
        catalogCategory: {type: String, required:true},
        description: String,
        rating: String,
        imageUrl: String

},{collection:'item'});

var itemModel = mongoose.model ('item', itemSchema);



/*
//TBD: remove the methods from item.js & add it to itemDB.js 
var getItems = function(){

  //return(items.itemsList);
}
*/
function getItems() {
 
     return new Promise((resolve, reject) => {
        itemModel.find({}).then(docs =>{
          //console.log(docs);
            resolve(docs);
        }).catch(err => {
            console.log("err");
            return reject(err);
        })
    })

}

/*
 * Description: method to get the item with the specific itemID
 */    
var getItem = function(itemId){
 
    return new Promise((resolve, reject) => {
        itemModel.findOne({itemCode:itemId}).then(docs =>{
            //console.log(docs);
            resolve(docs);
        }).catch(err => {
            console.log("err");
            return reject(err);
        })
    })
}

/* 
 * - function to return list of Categories
 * - Get all the items from the DB, and iterate over it to find unique categories
 * - TBD: replace this with a DB call that returns unique categories from the item collection
 */
var getCategoriesList = function(){
return new Promise((resolve, reject) => {
  
  getItems().then(docs => {
                itemsList = docs
                //  console.log(itemsList);
                //  console.log(itemsList.length);

var categoriesList = [itemsList[0].catalogCategory];
  console.log(categoriesList);
  console.log(categoriesList.length);
   for(var i = 0; i < itemsList.length;i++){
     var flag = false;
     for (var j = 0; j < categoriesList.length; j++) {
       if(itemsList[i].catalogCategory == categoriesList[j]){
         flag = true;
       }
     }
     if(flag == false){
        //insert into the categoriesList
        categoriesList[categoriesList.length] = itemsList[i].catalogCategory;
     }
   }


 // console.log(categoriesList);

   resolve(categoriesList);


        }).catch(err =>{
                console.error(err);
    })
     })
 }


 /* function to return elements belonging to a particular category
  * TBD: this is currently (Nov 12) not been used
  */
 var categoryItemList = function(categoryName){
   var categoryItemList = [];
   for(var i = 0; i < items.itemsList.length;i++){
     if(categoryName === items.itemsList[i].catalogCategory){
       //console.log('adding ' , items.itemsList[i].itemName);
       categoryItemList[categoryItemList.length] = items.itemsList[i];
     }
   }
   return(categoryItemList)

 }

/*
 * Check if an item is present in the DB of all items
 * TBD: replace this with a single DB call that returns the item if present
 */ 
 var isItemPresent = function(itemCode){


return new Promise((resolve, reject) => {
  
    getItems().then(docs => {
        itemsList = docs
        //console.log(itemsList);
        //console.log(itemsList.length);

        status = false;
        for(var i = 0; i < itemsList.length;i++){

            if(itemCode === itemsList[i].itemCode){
                status = true;
            }
        }
        resolve(status);
        }).catch(err =>{
        console.error(err);
        })
    })
}

/*
 * addItem (itemCode, itemName, catalogCategory, description, imageUrl)
 * - creates an item with the provided values and calls addItem(Item item)
 * TBD: test this 
 */
var addItem = function (itemCode, itemName, catalogCategory, description, rating, imageUrl){
    itemObj = new item.Item ({itemCode: itemCode, itemName: itemName, 
        catalogCategory: catalogCategory, description: description, rating: rating, imageUrl: imageUrl});
    addItem (itemObj);
}

/*
 * addItem (Item item)
 * Description: inserts an item to the item collection
 * TBD: test this 
 */
var addItem = function (item){
    console.log("Adding following item to DB: ", item);

    itemModel.findOneAndUpdate(
    {itemCode: item.itemCode, itemName: item.itemName}, // find a document with itemCode & itemName

    {$set : {  itemCode: item.itemCode,
               itemName: item.itemName,
               catalogCategory: item.catalogCategory,
               description: item.description,
               rating: item.rating,
               imageUrl: item.imageUrl
              }},
    
        {upsert: true, new: true, runValidators: true}, // options
    function (err, doc) { // callback
    console.log("student data object is ");
    })
}

module.exports.addItem = addItem;
module.exports.itemModel = itemModel; 
module.exports.getItems = getItems;
module.exports.getItem = getItem;
module.exports.getCategoriesList = getCategoriesList;
module.exports.categoryItemList = categoryItemList;
module.exports.isItemPresent = isItemPresent;
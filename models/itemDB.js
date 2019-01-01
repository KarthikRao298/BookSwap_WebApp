/*
 * static dummy DB for the application
 *
 */



function Item (itemCode,itemName, catalogCategory, description,rating,url){
    this.itemCode = itemCode;
    this.itemName = itemName;
    this.catalogCategory = catalogCategory;
    this.description = description;
    this.rating = rating;
    this.imageUrl = url;
}

/*

var description = 'A fiction/fantasy book, that is a must read! One of the best sellers of all time! ';

//item = new Item('','','',description,'','')
item1 = new Item('100','Harry Potter 1','Fiction',description,'5','/resources/images/harryPotter1.jpeg');
item2 = new Item('101','Harry Potter 2','Fiction',description,'5','/resources/images/harryPotter2.jpeg');
item3 = new Item('102','Harry Potter 3','Fiction',description,'5','/resources/images/harryPotter3.jpeg');

item4 = new Item('103','The Hobbit Part-1','Fantasy',description,'3','/resources/images/hobbit1.jpeg')
item5 = new Item('104','The Hobbit Part-2','Fantasy',description,'3','/resources/images/hobbit2.jpeg')
item6 = new Item('105','The Hobbit Part-3','Fantasy',description,'3','/resources/images/hobbit3.jpeg')

var itemsList = [item1,item2,item3,item4,item5,item6];





module.exports.itemsList = itemsList;

*/

module.exports.Item = Item;

//module.exports.getItem = getItem;
//module.exports.getItems = getItems;

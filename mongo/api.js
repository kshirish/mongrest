var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId;
var mongoapi = {};

mongoapi.getDatabase = function (dbname) {
    return mongojs(dbname);
};

mongoapi.getCollection = function (db, collectionname) {
    return  db.collection(collectionname);
};

mongoapi.getCollectionNames = function(db, callback) {
	db.getCollectionNames(callback);
};

mongoapi.getUniqueIdString = function() {
    return (new ObjectId()).toString();	// avoid ObjectId
};

mongoapi.getUniqueIdObject = function(id) {
    return ObjectId(id);
};

mongoapi.addDocs = function (collection, docs, callback) {

    docs._id = this.getUniqueIdString();
    collection.insert(docs, callback);
};

mongoapi.updateDocs = function (collection, query, update, options, callback) {

	var updateObj = {
		$inc: update.inc || {},
		$set: update.set || {}
	};

    collection.update(query, updateObj, options, callback);
};

mongoapi.findDocs = function (collection, query, criteria, options, callback) {   
    collection.find(query, criteria, options, callback);
};

mongoapi.removeDocs = function (collection, query, justOne, callback) {
    collection.remove( query, justOne, callback );
};

mongoapi.removeDb = function (db, callback) {
    db.dropDatabase( callback );
};

module.exports = mongoapi;
let mongojs = require('mongojs');
const ObjectId = mongojs.ObjectId;

module.exports = {
    getDatabase : dbname => mongojs(dbname),

    getCollection : (db, collectionname) => db.collection(collectionname),

    getCollectionNames : (db, callback) => db.getCollectionNames(callback),

    getUniqueIdString : () => (new ObjectId()).toString(),	// avoid ObjectId

    getUniqueIdObject : id => ObjectId(id),

    addDocs : (collection, docs, callback) => {

        docs._id = this.getUniqueIdString();
        collection.insert(docs, callback);
    },

    updateDocs : (collection, query, update, options, callback) => {

    	let updateObj = {
    		$inc: update.inc || {},
    		$set: update.set || {}
    	};

        collection.update(query, updateObj, options, callback);
    },

    findDocs : (collection, query, criteria, options, callback) => collection.find(query, criteria, options, callback),

    removeDocs : (collection, query, justOne, callback) => collection.remove( query, justOne, callback ),

    removeDb : (db, callback) => db.dropDatabase( callback )
};

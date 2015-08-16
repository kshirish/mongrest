var express = require('express');
var router = express.Router();
var mongoapi = require('../mongo/api.js');
var configDb = require('../config/database.js');


///////////////////////////////////////////////////////////////////////////
//////////////////////// TOKEN AUTHENTICATION ////////////////////////////
/////////////////////////////////////////////////////////////////////////

router.use(function(req, res, next) {

	var collection, 
		db,
		criteria,
		options,
		query,
		AUTH_ERROR = { data: 'Authentication Error.', error: true };

	// check if token is present	
	if(!req.body.query.token) {
		res.status(500).json(AUTH_ERROR);
	} else {

		db = mongoapi.getDatabase(configDb.auth.usersDb);

		collection = mongoapi.getCollection(db, configDb.auth.tokensCollection);
		query = {token: req.body.query.token};
		criteria = {};
		options = {};

		mongoapi.findDocs(collection, query, criteria, options, function(err, data) {

			if(err) {
				res.status(500).json(AUTH_ERROR);
			} else {
				next();
			}

		});			
	}	

});

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////  GET /////////////////////////////////
/////////////////////////////////////////////////////////////////////////

router.get('/', function(req, res, next) {
	res.json({ data: 'Welcome to Mongrest!', error: false });
});

router.get('/:db/:collection?/:id?', function(req, res, next) {

	var collection, 
		db,
		query,
		criteria,
		options,
		GET_SUCCESS = {data: data, error: false};

	db = mongoapi.getDatabase(req.params.db);

	if( req.params.db && req.params.collection && req.params.id ) {

		// return doc according to id
		collection = mongoapi.getCollection(db, req.params.collection);
		query = {_id: mongoapi.getUniqueIdObject(req.params.id)};
		criteria = {_id:0};
		options = {};

		mongoapi.findDocs(collection, query, criteria, options, function(err, data) {

			if(err) {
				next();
			} else {
				res.json(GET_SUCCESS);
			}

		});	

	} else if( req.params.db && req.params.collection && req.body.query ) {

		// return doc according to `query`
		collection = mongoapi.getCollection(db, req.params.collection);
		query = req.body.query;
		criteria = {_id:0};
		options = {limit: configDb.defaultLimit};

		mongoapi.findDocs(collection, query, criteria, options, function(err, data) {

			if(err) {
				next();
			} else {
				res.json(GET_SUCCESS);
			}

		});	

	} else if( req.params.db && req.params.collection ) {

		// return all the docs in the collection
		collection = mongoapi.getCollection(db, req.params.collection);
		query = {};
		criteria = {_id:0};
		options = {limit: configDb.defaultLimit};

		mongoapi.findDocs(collection, query, criteria, options, function(err, data) {

			if(err) {
				next();
			} else {
				res.json(GET_SUCCESS);
			}

		});	
	} else {

		// return collection names of the db
		mongoapi.getCollectionNames(db, function(err, cols) {

			if(err) {
				next();
			} else {
				res.json({data: cols, error: false});
			}
		});
	}
});

///////////////////////////////////////////////////////////////////////////
/////////////////////////////////// DELETE ///////////////////////////////
/////////////////////////////////////////////////////////////////////////

router.delete('/:db/:collection?/:id?', function(req, res, next) {

	var collection, 
		db,
		query,
		criteria,
		options,
		DELETE_SUCCESS = {data: 'Deleted successfully.', error: false};

	db = mongoapi.getDatabase(req.params.db);

	if( req.params.db && req.params.collection && req.params.id ) {

		// remove doc according to id
		collection = mongoapi.getCollection(db, req.params.collection);
		query = {_id: mongoapi.getUniqueIdObject(req.params.id)};

        mongoapi.removeDocs(collection, query, true, function (err) {

            if(err) {
                next();
            } else {
            	res.json(DELETE_SUCCESS);
            }
        });	

	} else if( req.params.db && req.params.collection && req.body.query ) {

		// remove doc according to `query`
		collection = mongoapi.getCollection(db, req.params.collection);
		query = req.body.query;

        mongoapi.removeDocs(collection, query, false, function (err) {

            if(err) {
                next();
            } else {
            	res.json(DELETE_SUCCESS);
            }
        });	

	} else if( req.params.db && req.params.collection ) {

		// remove all the docs in the collection
		collection = mongoapi.getCollection(db, req.params.collection);
		query = {};

        mongoapi.removeDocs(collection, query, false, function (err) {

            if(err) {
                next();
            } else {
            	res.json(DELETE_SUCCESS);
            }
        });	

	} else {

		// remove db
		mongoapi.removeDb(db, function(err) {

            if(err) {
                next();
            } else {
            	res.json(DELETE_SUCCESS);
            }
		});
	}
});
///////////////////////////////////////////////////////////////////////////
/////////////////////////////////// POST /////////////////////////////////
/////////////////////////////////////////////////////////////////////////

router.post('/:db/:collection?/:id?', function(req, res, next) {

	var collection, 
		db,
		query,
		criteria,
		postObj,
		options,
		UPDATE_SUCCESS = {data: 'Updated successfully.', error: false};

	db = mongoapi.getDatabase(req.params.db);

	if( req.params.db && req.params.collection && req.params.id ) {

		// update doc according to id
		collection = mongoapi.getCollection(db, req.params.collection);
		query = {_id: mongoapi.getUniqueIdObject(req.params.id)};
		postObj = req.body.post;

		mongoapi.updateDocs(collection, query, postObj, function (err) {

            if(err) {
                next();
            } else {
            	res.json(UPDATE_SUCCESS);
            }
            
        });

	} else if( req.params.db && req.params.collection && req.body.query ) {

		// update doc according to `query`
		collection = mongoapi.getCollection(db, req.params.collection);
		query = req.body.query;
		postObj = req.body.post;

		mongoapi.updateDocs(collection, query, postObj, function (err) {

            if(err) {
                next();
            } else {
            	res.json(UPDATE_SUCCESS);
            }
            
        });

	} else if( req.params.db && req.params.collection ) {

		// add doc in the collection
		collection = mongoapi.getCollection(db, req.params.collection);
		postObj = req.body.post;

		mongoapi.addDocs(collection, postObj, function (err) {

            if(err) {
                next();
            } else {
            	res.json(UPDATE_SUCCESS);
            }

        });
	}
});

module.exports = router;

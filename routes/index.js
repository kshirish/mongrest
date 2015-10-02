let express = require('express');
let router = express.Router();
let mongoapi = require('../mongo/api.js');
const configDb = require('../config/database.js');

let isEmpty = obj => !Object.keys(obj).length;

///////////////////////////////////////////////////////////////////////////
//////////////////////// TOKEN AUTHENTICATION ////////////////////////////
/////////////////////////////////////////////////////////////////////////

// router.use(function(req, res, next) {

// 	let collection,
// 		db,
// 		criteria,
// 		options,
// 		query,
// 		AUTH_ERROR = { data: 'Authentication Error.', error: true };

// 	// check if token is present
// 	if(!req.body.query.token) {
// 		res.status(500).json(AUTH_ERROR);
// 	} else {

// 		db = mongoapi.getDatabase(configDb.auth.usersDb);

// 		collection = mongoapi.getCollection(db, configDb.auth.tokensCollection);
// 		query = {token: req.body.query.token};
// 		criteria = {};
// 		options = {};

// 		mongoapi.findDocs(collection, query, criteria, options, function(err, data) {

// 			if(err) {
// 				res.status(500).json(AUTH_ERROR);
// 			} else {
// 				next();
// 			}

// 		});
// 	}

// });

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////  GET /////////////////////////////////
/////////////////////////////////////////////////////////////////////////

router.get('/', (req, res, next) => {
	res.json({ data: 'Welcome to Mongrest!', error: false });
});

router.get('/:db/:collection?/:id?', (req, res, next) => {

	let collection,
		db,
		query,
		criteria,
		options,
		GET_SUCCESS = {error: false};

	db = mongoapi.getDatabase(req.params.db);

	if( req.params.collection && req.params.id ) {

		// return doc according to id
		collection = mongoapi.getCollection(db, req.params.collection);
		query = {_id: mongoapi.getUniqueIdObject(req.params.id)};
		criteria = {_id:0};
		options = {};

		mongoapi.findDocs(collection, query, criteria, options, (err, data) => {

			if(err) {
				next();
			} else {
				GET_SUCCESS.data = data;
				res.json(GET_SUCCESS);
			}

		});

	} else if( req.params.collection ) {

		// return doc according to `query`
		collection = mongoapi.getCollection(db, req.params.collection);
		query = isEmpty(req.query) ? {} : req.query;
		criteria = {_id:0};
		options = {limit: configDb.defaultLimit};

		mongoapi.findDocs(collection, query, criteria, options, (err, data) => {

			if(err) {
				next();
			} else {
				GET_SUCCESS.data = data;
				res.json(GET_SUCCESS);
			}

		});

	} else {

		// return collection names of the db
		mongoapi.getCollectionNames(db, (err, cols) => {

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

router.delete('/:db/:collection?/:id?', (req, res, next) => {

	let collection,
		db,
		query,
		criteria,
		options,
		DELETE_SUCCESS = {data: 'Deleted successfully.', error: false};

	db = mongoapi.getDatabase(req.params.db);

	if( req.params.collection && req.params.id ) {

		// remove doc according to id
		collection = mongoapi.getCollection(db, req.params.collection);
		query = {_id: mongoapi.getUniqueIdObject(req.params.id)};

        mongoapi.removeDocs(collection, query, true, err => {

            if(err) {
                next();
            } else {
            	res.json(DELETE_SUCCESS);
            }
        });

	} else if( req.params.collection ) {

		// remove doc according to `query`
		collection = mongoapi.getCollection(db, req.params.collection);
		query = isEmpty(req.body) ? {} : req.body;

        mongoapi.removeDocs(collection, query, false, err => {

            if(err) {
                next();
            } else {
            	res.json(DELETE_SUCCESS);
            }
        });

	} else {

		// remove db
		mongoapi.removeDb(db, err => {

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

router.post('/:db/:collection?/:id?', (req, res, next) => {

	let collection,
		db,
		query,
		criteria,
		postObj,
		options,
		UPDATE_SUCCESS = {data: 'Updated successfully.', error: false};

	db = mongoapi.getDatabase(req.params.db);

	if( req.params.collection && req.params.id ) {

		// update doc according to id
		collection = mongoapi.getCollection(db, req.params.collection);
		query = {_id: mongoapi.getUniqueIdObject(req.params.id)};
		postObj = isEmpty(req.body) ? {} : req.body;

		mongoapi.updateDocs(collection, query, postObj, err => {

            if(err) {
                next();
            } else {
            	res.json(UPDATE_SUCCESS);
            }

        });

	} else if( req.params.collection ) {

		// update doc according to `query`
		collection = mongoapi.getCollection(db, req.params.collection);
		query = isEmpty(req.query) ? {} : req.query;
		postObj = isEmpty(req.body) ? {} : req.body;

		mongoapi.updateDocs(collection, query, postObj, err => {

            if(err) {
                next();
            } else {
            	res.json(UPDATE_SUCCESS);
            }

        });

	}
});

module.exports = router;

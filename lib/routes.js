const mongojs = require('mongojs');
const q2m = require('query-to-mongo');
const { ObjectId } = mongojs;
const { isPositive } = require('./utils');

module.exports = (app, config) => {

	let db;

	// connect to db
	app.get('/connect', (req, res) => {

		db = mongojs(config.url);
		res.json({ message: 'Connected successfully to server.' });
	});

	// db stats
	app.get('/stats', (req, res) => {
		
		db.stats((err, result) => {

			if(err) throw err;

			res.json(result);		
		});
	});

	// list collection names
	app.get('/list', (req, res) => {
		
		db.getCollectionNames((err, result) => {

			if(err) throw err;

			res.json(result);		
		});
	});

	// get docs from a collection [given id, fields, sorting, limit, skip]
	app.get('/:collection/:id?', (req, res) => {

		const criteria = req.params.id ? { _id: ObjectId(req.params.id) } : {};
		let projection;
		let sort = {};

		if(req.query.fields) {

			projection = req.query.fields.split(',').reduce((acc, curr) => {

				acc[isPositive(curr) ? curr : curr.slice(1)] = isPositive(curr) ? 1 : 0;
				return acc;

			}, {});
		}	

		if(req.query.sort) {

			sort = req.query.sort.split(',').reduce((acc, curr) => {

				acc[isPositive(curr) ? curr : curr.slice(1)] = isPositive(curr) ? 1 : -1;
				return acc;

			}, sort);
		}

		let query = db.collection(req.params.collection).find(criteria, projection)

		if(req.query.limit) {
			query = query.limit(parseInt(req.query.limit));
		}

		if(req.query.skip) {
			query = query.skip(parseInt(req.query.skip));
		}

		query = query.sort(req.query.sort, (err, docs) => {

			if(err) throw err;

			res.json(docs);
		});

	});

	// create a new collection
	app.post('/:collection/new', (req, res) => {
		
		db.createCollection(req.params.collection, (err, result) => {
				
			if(err) throw err;

			res.json(result);
		});
	});

	// filter collection
	app.post('/:collection/filter', (req, res) => {

		const { criteria, options } = q2m(req.body.query);

		let projection;		

		if(options.fields) {

			projection = {};

			for(key in options.fields) {
				projection[key] = options.fields[key] ? 1 : 0
			}			
		}	

		let query = db.collection(req.params.collection).find(criteria, projection)

		if(options.limit) {
			query = query.limit(options.limit);
		}

		if(options.offset) {
			query = query.skip(options.offset);
		}

		query = query.sort(options.sort || {}, (err, docs) => {

			if(err) throw err;

			res.json(docs);
		});
	});

	// inesrt a new doc into a collection
	app.post('/:collection/add', (req, res) => {

		db.collection(req.params.collection).insert(req.body, (err, docs) => {
				
			if(err) throw err;

			res.json(docs);
		});
	});

	// update a doc [given id]
	app.put('/:collection/:id', (req, res) => {


		const criteria = { _id: ObjectId(req.params.id) };
		const update = { $set: req.body };

		db.collection(req.params.collection).findAndModify({ query: criteria, update }, (err, doc) => {
				
			if(err) throw err;

			res.json({ ...doc, ...update });
		});
	});

	// drop a collection
	app.delete('/:collection', (req, res) => {

		db.collection(req.params.collection).drop((err, result) => {
				
			if(err) throw err;

			res.json(result);
		});
	});

	// drop a doc [given id] from a collection
	app.delete('/:collection/:id', (req, res) => {

		const criteria = { _id: ObjectId(req.params.id) };

		db.collection(req.params.collection).remove(criteria, (err, result) => {
				
			if(err) throw err;

			res.json(result);
		});
	});

	// 404
	app.get('*', (req, res) => {
		res.status(404).json({ message: 'Welcome to 404!' });
	});
}
const CustomModal = require('../models/model');

// mongoose schema types
const schemaTypes = require('../config');

module.exports = (app) => {

	// index page
	app.get('/', (req, res) => {

		CustomModal.find()
			.then((results) => {

				const types = results.map(result => result.name).concat(schemaTypes);
				res.render('index.ejs', {types});
			}).
			catch(() => res.json({success: false, message: 'Failed to get types!'}));		
	});
}

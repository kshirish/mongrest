const CustomModal = require('../models/model');
const handleGets = require('./get.js');

module.exports = (router) => {

	router.post('/model', (req, res) => {

		// capitalize model name
		const name = req.body.name.substring(0, 1).toUpperCase() + req.body.name.substring(1);
		const model = new CustomModal({
			name,
			columns: req.body.columns
		});
		
		model.save()
			.then(() => res.json({success: true, message: `${name} has been created successfully!`}))
			.catch(() => res.json({success: false, message: 'Sorry, couldn\'t create the model!'}));
	});

	router.get('*', handleGets);

	router.post('*', (req, res) => {
		
		res.json({method: 'POST', message: 'Still in progress!'});
	});

	router.delete('*', (req, res) => {
		
		res.json({method: 'DELETE', message: 'Still in progress!'});
	});

	router.put('*', (req, res) => {
		
		res.json({method: 'PUT', message: 'Still in progress!'});
	});
}

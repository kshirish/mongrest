const MyModel = require('./models/model');

module.exports = (router) => {

	router.post('/create', (req, res) => {

		// capitalize model name
		const name = req.body.modelName.substring(0, 1).toUpperCase() + req.body.modelName.substring(1);
		const model = new MyModel({
			name,
			columns: req.body.columns
		});

		console.log(model);
		
		model.save()
			.then(() => res.json({success: true, message: `${name} has been created successfully!`}))
			.catch(() => res.json({success: false, message: 'Sorry, couldn\'t create the model!'}));
	});

	router.get('*', (req, res) => {
		
		console.log(req.url);
		res.json({method: 'GET', message: 'Still in progress!'});
	});

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

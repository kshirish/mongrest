const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Utils = require('../utils');

module.exports = (req, res) => {

	let counter = 0;		
	const urlComponents = req.url.substring(1).split('/');		
	
	function getFoo(results) {

		if(counter >= urlComponents.length) {

			return res.json({success: true, data: results});

		} else if(results && Array.isArray(results)) {

			let data = results.find(elem => elem._id = ObjectId(urlComponents[counter + 1]));

			if(!data) {
				res.json({success: false, message: 'Error occured in the query.'});
			}

			counter = counter + 2;
			getFoo(data[urlComponents[counter]]);

		} else {

			Utils.toModel(urlComponents[counter])
				.then(Model => {

					Model.findById(urlComponents[counter + 1])
						.then(result => {

							counter = counter + 2;
							getFoo(result[urlComponents[counter]]);
						});
						
				})
				.catch(() =>  res.json({success: false, message: 'Error occured in the query.'}));
		}
	}

	getFoo();
};
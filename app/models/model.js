const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const schema = new mongoose.Schema({
	created: { 
		type: Date, 
		default: Date.now 
	},
	name: String,
	columns: [{
		name: String,
		value: String
	}]
});

module.exports = mongoose.model('MyModel', schema);
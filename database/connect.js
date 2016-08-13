const {url} = require('../config');
const mongoose = require('mongoose');
const db = mongoose.connection;

module.exports = () => {

	// listening to database
	db.on('error', (err) => console.log('Error in connecting database :('))
	.once('open', () => {
		console.log('Database Connected :)');
	});

	// connecting to mongo server
	mongoose.connect(url);
};

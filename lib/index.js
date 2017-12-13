const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const morgan = require('morgan');

module.exports = (config) => {

	const port = config.port || process.env.PORT || 3000;

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(methodOverride('X-HTTP-Method-Override'));
	app.use(morgan('dev'));

	require('./routes')(app, config);

	app.listen(port, () => console.log(`Listening to port - ${port}`));
}
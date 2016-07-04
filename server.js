const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const morgan = require('morgan');
const connect = require('./database/connect');

// mongoose columns types
const types = ['String', 'Number', 'Date', 'Buffer', 'Boolean', 'Mixed', 'Objectid', 'Array']

// config 
const {url} = require('./config');

// port
const port = process.env.PORT || 9999;

// connect to database
connect();

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simulate PUT and DELETE
app.use(methodOverride('X-HTTP-Method-Override'));

// static files
app.use(express.static(`${__dirname}/public`));

// use morgan to log requests to the console
app.use(morgan('dev'));

// use `ejs` for templating
app.set('views', './public/views');
app.set('view engine', 'ejs');

// index page
app.get('/', (req, res) => {
	res.render('index.ejs', {types});
});

// route's namespace
app.use('/api', router);

// passing on router to routes
require('./app/routes')(router);

// catch all
app.get('*', (req, res) => {
	res.render('index.ejs', {types});
});

// listen to a port
app.listen(port, () => console.log(`Listening to port - ${port}`));

// expose app
module.exports = app;